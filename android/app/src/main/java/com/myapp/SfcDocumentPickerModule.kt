package com.myapp

import android.app.Activity
import android.content.Intent
import android.net.Uri
import android.provider.OpenableColumns
import com.facebook.react.bridge.ActivityEventListener
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableArray

class SfcDocumentPickerModule(
  private val reactContext: ReactApplicationContext,
) : ReactContextBaseJavaModule(reactContext), ActivityEventListener {

  private var pendingPromise: Promise? = null

  init {
    reactContext.addActivityEventListener(this)
  }

  override fun getName(): String = "SfcDocumentPicker"

  @ReactMethod
  fun pickDocuments(promise: Promise) {
    if (pendingPromise != null) {
      promise.reject("PICKER_BUSY", "Document picker is already open.")
      return
    }

    val activity = reactApplicationContext.currentActivity
    if (activity == null) {
      promise.reject("NO_ACTIVITY", "Cannot open file manager right now.")
      return
    }

    val intent = Intent(Intent.ACTION_OPEN_DOCUMENT).apply {
      addCategory(Intent.CATEGORY_OPENABLE)
      type = "*/*"
      putExtra(Intent.EXTRA_ALLOW_MULTIPLE, true)
      putExtra(
        Intent.EXTRA_MIME_TYPES,
        arrayOf(
          "application/pdf",
          "image/jpeg",
          "image/png",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "text/plain",
        ),
      )
      addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
      addFlags(Intent.FLAG_GRANT_PERSISTABLE_URI_PERMISSION)
    }

    pendingPromise = promise

    try {
      activity.startActivityForResult(intent, REQUEST_CODE)
    } catch (error: Exception) {
      pendingPromise = null
      promise.reject("PICKER_FAILED", "Could not open file manager.", error)
    }
  }

  override fun onActivityResult(
    activity: Activity,
    requestCode: Int,
    resultCode: Int,
    data: Intent?,
  ) {
    if (requestCode != REQUEST_CODE) {
      return
    }

    val promise = pendingPromise ?: return
    pendingPromise = null

    if (resultCode != Activity.RESULT_OK) {
      promise.resolve(Arguments.createArray())
      return
    }

    val documents = Arguments.createArray()
    val clipData = data?.clipData

    if (clipData != null) {
      for (index in 0 until clipData.itemCount) {
        addDocument(documents, clipData.getItemAt(index).uri)
      }
    } else {
      data?.data?.let { uri -> addDocument(documents, uri) }
    }

    promise.resolve(documents)
  }

  override fun onNewIntent(intent: Intent) = Unit

  private fun addDocument(documents: WritableArray, uri: Uri) {
    val resolver = reactContext.contentResolver
    val document = Arguments.createMap()
    var name = uri.lastPathSegment ?: "document"
    var size: Double? = null

    resolver.query(uri, null, null, null, null)?.use { cursor ->
      if (cursor.moveToFirst()) {
        val nameIndex = cursor.getColumnIndex(OpenableColumns.DISPLAY_NAME)
        val sizeIndex = cursor.getColumnIndex(OpenableColumns.SIZE)

        if (nameIndex >= 0) {
          name = cursor.getString(nameIndex) ?: name
        }

        if (sizeIndex >= 0 && !cursor.isNull(sizeIndex)) {
          size = cursor.getLong(sizeIndex).toDouble()
        }
      }
    }

    try {
      resolver.takePersistableUriPermission(uri, Intent.FLAG_GRANT_READ_URI_PERMISSION)
    } catch (_: SecurityException) {
      // Some providers grant temporary read access only. React Native can still upload it now.
    }

    document.putString("uri", uri.toString())
    document.putString("name", name)
    document.putString("type", resolver.getType(uri) ?: "application/octet-stream")

    if (size != null) {
      document.putDouble("size", size!!)
    } else {
      document.putNull("size")
    }

    documents.pushMap(document)
  }

  companion object {
    private const val REQUEST_CODE = 6321
  }
}
