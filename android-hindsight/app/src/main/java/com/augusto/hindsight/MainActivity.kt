package com.augusto.hindsight

import android.Manifest
import android.content.*
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import android.os.IBinder
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import androidx.camera.view.PreviewView
import androidx.core.content.ContextCompat

class MainActivity : AppCompatActivity() {
    private var service: RecorderService? = null
    private lateinit var preview: PreviewView
    private lateinit var status: TextView
    private lateinit var toggle: Button
    private val befores = listOf(15, 30, 60, 120)
    private val afters = listOf(0, 5, 15, 30)

    private val conn = object : ServiceConnection {
        override fun onServiceConnected(n: ComponentName, b: IBinder) {
            service = (b as RecorderService.LocalBinder).service.also {
                it.attachPreview(preview.surfaceProvider)
                it.onStatus = { s -> runOnUiThread { status.text = s } }
            }
            toggle.text = "Desligar"
        }
        override fun onServiceDisconnected(n: ComponentName) { service = null }
    }

    override fun onCreate(s: Bundle?) {
        super.onCreate(s)
        setContentView(R.layout.activity_main)
        preview = findViewById(R.id.preview)
        status = findViewById(R.id.status)
        toggle = findViewById(R.id.toggle)
        val before = findViewById<Spinner>(R.id.before)
        val after = findViewById<Spinner>(R.id.after)
        before.adapter = ArrayAdapter(this, android.R.layout.simple_spinner_dropdown_item, befores.map { "${it}s" })
        after.adapter = ArrayAdapter(this, android.R.layout.simple_spinner_dropdown_item, afters.map { "${it}s" })
        before.setSelection(1); after.setSelection(1)

        toggle.setOnClickListener {
            if (service != null) {
                service?.detachPreview()
                unbindService(conn); service = null
                stopService(Intent(this, RecorderService::class.java))
                toggle.text = "Ligar Hindsight"; status.text = "Desligado"
            } else if (hasPerms()) {
                val i = Intent(this, RecorderService::class.java)
                    .putExtra("before", befores[before.selectedItemPosition])
                ContextCompat.startForegroundService(this, i)
                bindService(i, conn, 0)
            } else requestPerms()
        }
        findViewById<Button>(R.id.save).setOnClickListener {
            service?.save(afters[after.selectedItemPosition])
                ?: Toast.makeText(this, "Ligue o Hindsight primeiro", Toast.LENGTH_SHORT).show()
        }
        // reconecta se o serviço já estiver rodando
        bindService(Intent(this, RecorderService::class.java), conn, 0)
        if (!hasPerms()) requestPerms()
    }

    override fun onDestroy() {
        service?.detachPreview(); service?.onStatus = null
        if (service != null) unbindService(conn)
        super.onDestroy()
    }

    private fun perms() = buildList {
        add(Manifest.permission.CAMERA); add(Manifest.permission.RECORD_AUDIO)
        if (Build.VERSION.SDK_INT >= 33) add(Manifest.permission.POST_NOTIFICATIONS)
        if (Build.VERSION.SDK_INT <= 28) add(Manifest.permission.WRITE_EXTERNAL_STORAGE)
    }
    private fun hasPerms() = perms().all { checkSelfPermission(it) == PackageManager.PERMISSION_GRANTED }
    private fun requestPerms() = requestPermissions(perms().toTypedArray(), 1)
}
