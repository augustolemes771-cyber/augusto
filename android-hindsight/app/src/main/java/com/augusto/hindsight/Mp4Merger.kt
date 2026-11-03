package com.augusto.hindsight

import android.content.ContentValues
import android.content.Context
import android.media.*
import android.net.Uri
import android.os.Build
import android.os.Environment
import android.provider.MediaStore
import java.io.File
import java.nio.ByteBuffer
import java.text.SimpleDateFormat
import java.util.*

object Mp4Merger {
    /** Junta segmentos MP4 (mesmo formato) sem recodificar e salva na galeria. */
    fun mergeToGallery(ctx: Context, files: List<File>): Uri? {
        if (files.isEmpty()) return null
        val out = File(ctx.cacheDir, "merged_${System.currentTimeMillis()}.mp4")
        merge(files, out)
        val name = "hindsight_" + SimpleDateFormat("yyyyMMdd_HHmmss", Locale.US).format(Date()) + ".mp4"
        val uri: Uri?
        if (Build.VERSION.SDK_INT >= 29) {
            val cv = ContentValues().apply {
                put(MediaStore.Video.Media.DISPLAY_NAME, name)
                put(MediaStore.Video.Media.MIME_TYPE, "video/mp4")
                put(MediaStore.Video.Media.RELATIVE_PATH, "Movies/Hindsight")
            }
            uri = ctx.contentResolver.insert(MediaStore.Video.Media.EXTERNAL_CONTENT_URI, cv)
            uri?.let { u -> ctx.contentResolver.openOutputStream(u)?.use { o -> out.inputStream().use { it.copyTo(o) } } }
        } else {
            val dir = File(Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_MOVIES), "Hindsight")
            dir.mkdirs()
            val dest = File(dir, name)
            out.copyTo(dest, true)
            MediaScannerConnection.scanFile(ctx, arrayOf(dest.path), null, null)
            uri = Uri.fromFile(dest)
        }
        out.delete()
        return uri
    }

    private fun merge(files: List<File>, out: File) {
        val muxer = MediaMuxer(out.path, MediaMuxer.OutputFormat.MUXER_OUTPUT_MPEG_4)
        MediaMetadataRetriever().apply {
            setDataSource(files.first().path)
            extractMetadata(MediaMetadataRetriever.METADATA_KEY_VIDEO_ROTATION)?.toIntOrNull()
                ?.let { muxer.setOrientationHint(it) }
            release()
        }
        // mapeia tipo ("video"/"audio") -> índice no muxer usando o 1º arquivo
        val trackOf = HashMap<String, Int>()
        MediaExtractor().apply {
            setDataSource(files.first().path)
            for (i in 0 until trackCount) {
                val f = getTrackFormat(i); val mime = f.getString(MediaFormat.KEY_MIME) ?: continue
                val kind = mime.substringBefore('/')
                if (kind !in trackOf) trackOf[kind] = muxer.addTrack(f)
            }
            release()
        }
        muxer.start()
        val buf = ByteBuffer.allocate(4 * 1024 * 1024)
        val info = MediaCodec.BufferInfo()
        var offsetUs = 0L
        for (file in files) {
            val ex = MediaExtractor(); ex.setDataSource(file.path)
            var maxUs = 0L
            val map = HashMap<Int, Int>()
            for (i in 0 until ex.trackCount) {
                val kind = ex.getTrackFormat(i).getString(MediaFormat.KEY_MIME)?.substringBefore('/') ?: continue
                trackOf[kind]?.let { map[i] = it; ex.selectTrack(i) }
            }
            var firstUs = -1L
            while (true) {
                val size = ex.readSampleData(buf, 0)
                if (size < 0) break
                val t = ex.sampleTime
                if (firstUs < 0) firstUs = t
                val dst = map[ex.sampleTrackIndex]
                if (dst != null) {
                    info.offset = 0; info.size = size
                    info.presentationTimeUs = offsetUs + (t - firstUs).coerceAtLeast(0)
                    info.flags = if (ex.sampleFlags and MediaExtractor.SAMPLE_FLAG_SYNC != 0)
                        MediaCodec.BUFFER_FLAG_KEY_FRAME else 0
                    muxer.writeSampleData(dst, buf, info)
                    maxUs = maxOf(maxUs, info.presentationTimeUs)
                }
                ex.advance()
            }
            ex.release()
            offsetUs = maxUs + 33_000
        }
        muxer.stop(); muxer.release()
    }
}
