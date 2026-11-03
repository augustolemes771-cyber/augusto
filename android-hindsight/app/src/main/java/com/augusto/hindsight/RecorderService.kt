package com.augusto.hindsight

import android.annotation.SuppressLint
import android.app.*
import android.content.Intent
import android.content.pm.ServiceInfo
import android.os.*
import androidx.camera.core.CameraSelector
import androidx.camera.core.Preview
import androidx.camera.lifecycle.ProcessCameraProvider
import androidx.camera.video.*
import androidx.core.app.NotificationCompat
import androidx.core.app.ServiceCompat
import androidx.core.content.ContextCompat
import androidx.lifecycle.LifecycleService
import java.io.File
import java.util.concurrent.Executors

/**
 * Grava sem parar em segmentos curtos e mantém só os últimos N segundos.
 * Ao salvar, junta os segmentos guardados (+ os gravados depois) num único MP4.
 */
class RecorderService : LifecycleService() {
    inner class LocalBinder : Binder() { val service get() = this@RecorderService }
    private val binder = LocalBinder()
    private val main = Handler(Looper.getMainLooper())
    private val io = Executors.newSingleThreadExecutor()

    private val segMs = 5_000L
    private var beforeSec = 30
    private val preview = Preview.Builder().build()
    private lateinit var videoCapture: VideoCapture<Recorder>
    private var recording: Recording? = null
    private var currentFile: File? = null
    private val segments = ArrayDeque<File>()
    private var job: SaveJob? = null
    private var running = false
    var onStatus: ((String) -> Unit)? = null

    private class SaveJob(val files: MutableList<File>, val endAt: Long)

    override fun onBind(intent: Intent): IBinder { super.onBind(intent); return binder }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        super.onStartCommand(intent, flags, startId)
        if (intent?.action == ACTION_SAVE) { save(5); return START_NOT_STICKY }
        if (running) return START_NOT_STICKY
        beforeSec = intent?.getIntExtra("before", 30) ?: 30
        goForeground()
        startCamera()
        running = true
        return START_NOT_STICKY
    }

    private fun goForeground() {
        val nm = getSystemService(NotificationManager::class.java)
        if (Build.VERSION.SDK_INT >= 26)
            nm.createNotificationChannel(NotificationChannel("hs", "Hindsight", NotificationManager.IMPORTANCE_LOW))
        val pi = PendingIntent.getService(this, 1,
            Intent(this, RecorderService::class.java).setAction(ACTION_SAVE), PendingIntent.FLAG_IMMUTABLE)
        val open = PendingIntent.getActivity(this, 2,
            Intent(this, MainActivity::class.java), PendingIntent.FLAG_IMMUTABLE)
        val n = NotificationCompat.Builder(this, "hs")
            .setSmallIcon(android.R.drawable.presence_video_online)
            .setContentTitle("Hindsight gravando")
            .setContentText("Guardando os últimos ${beforeSec}s")
            .setContentIntent(open)
            .addAction(0, "SALVAR", pi)
            .setOngoing(true).build()
        val type = if (Build.VERSION.SDK_INT >= 30)
            ServiceInfo.FOREGROUND_SERVICE_TYPE_CAMERA or ServiceInfo.FOREGROUND_SERVICE_TYPE_MICROPHONE else 0
        ServiceCompat.startForeground(this, 7, n, type)
    }

    private fun startCamera() {
        val f = ProcessCameraProvider.getInstance(this)
        f.addListener({
            val provider = f.get()
            val recorder = Recorder.Builder()
                .setQualitySelector(QualitySelector.from(Quality.FHD,
                    FallbackStrategy.lowerQualityOrHigherThan(Quality.SD)))
                .build()
            videoCapture = VideoCapture.withOutput(recorder)
            provider.unbindAll()
            provider.bindToLifecycle(this, CameraSelector.DEFAULT_BACK_CAMERA, preview, videoCapture)
            startSegment()
            tick()
        }, ContextCompat.getMainExecutor(this))
    }

    @SuppressLint("MissingPermission")
    private fun startSegment() {
        val file = File(cacheDir, "seg_${System.currentTimeMillis()}.mp4")
        currentFile = file
        recording = videoCapture.output
            .prepareRecording(this, FileOutputOptions.Builder(file).build())
            .withAudioEnabled()
            .start(ContextCompat.getMainExecutor(this)) { e ->
                if (e is VideoRecordEvent.Finalize) onSegmentDone(file, e)
            }
        main.postDelayed(rotate, segMs)
    }

    private val rotate = Runnable {
        recording?.stop(); recording = null
        if (running) startSegment()
    }

    private fun onSegmentDone(file: File, e: VideoRecordEvent.Finalize) {
        if (e.hasError() && (!file.exists() || file.length() < 1024)) { file.delete(); return }
        val j = job
        if (j != null) {
            j.files.add(file)
            if (System.currentTimeMillis() >= j.endAt) { job = null; merge(j.files) }
        } else {
            segments.addLast(file)
            val keep = (beforeSec * 1000 / segMs).toInt() + 1
            while (segments.size > keep) segments.removeFirst().delete()
        }
    }

    fun save(afterSec: Int) {
        if (!running || job != null) { onStatus?.invoke("Aguarde, já salvando…"); return }
        val files = segments.toMutableList(); segments.clear()
        job = SaveJob(files, System.currentTimeMillis() + afterSec * 1000L)
        onStatus?.invoke(if (afterSec > 0) "Gravando mais ${afterSec}s…" else "Salvando…")
        // termina o segmento atual quando o tempo "depois" acabar
        main.removeCallbacks(rotate)
        main.postDelayed(rotate, maxOf(afterSec * 1000L, 300L))
    }

    private fun merge(files: List<File>) {
        onStatus?.invoke("Juntando vídeo…")
        io.execute {
            val msg = try {
                val uri = Mp4Merger.mergeToGallery(this, files)
                "Salvo na galeria (Movies/Hindsight)" + if (uri == null) " — erro" else ""
            } catch (t: Throwable) { "Erro ao salvar: ${t.message}" }
            files.forEach { it.delete() }
            main.post { onStatus?.invoke(msg) }
        }
    }

    private fun tick() {
        if (!running) return
        if (job == null) {
            val s = minOf(segments.size * segMs / 1000, beforeSec.toLong())
            onStatus?.invoke("● Gravando — buffer ${s}s de ${beforeSec}s")
        }
        main.postDelayed(::tick, 1000)
    }

    fun attachPreview(p: Preview.SurfaceProvider) = preview.setSurfaceProvider(p)
    fun detachPreview() = preview.setSurfaceProvider(null)

    override fun onDestroy() {
        running = false
        main.removeCallbacksAndMessages(null)
        recording?.stop()
        segments.forEach { it.delete() }
        super.onDestroy()
    }

    companion object { const val ACTION_SAVE = "save" }
}
