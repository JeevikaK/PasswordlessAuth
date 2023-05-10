import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'package:example/utils/models.dart';
import 'package:http/http.dart' as http;
import 'package:camera/camera.dart';
import 'package:example/main.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:video_player/video_player.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:web_socket_channel/web_socket_channel.dart';

class FacialVerification extends StatefulWidget {
  final String username;
  final String appID;
  final String channelID;
  final CameraDescription camera;
  const FacialVerification({
    Key? key,
    required this.camera,
    required this.username,
    required this.appID,
    required this.channelID,
  }) : super(key: key);
  @override
  _FacialVerificationState createState() => _FacialVerificationState();
}

class _FacialVerificationState extends State<FacialVerification> {
  late CameraDescription camera;
  late String filePath;
  late CameraController _controller;
  late Future<void> _initializeControllerFuture;

  late String videoPath;

  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();

  Future<void> initCamera(CameraDescription camera) async {
    _controller = CameraController(
      camera,
      ResolutionPreset.high,
    );
    _initializeControllerFuture = _controller.initialize();
    // print('camera intialized succesfully');
  }

  @override
  initState() {
    super.initState();
    initCamera(widget.camera);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: _scaffoldKey,
      appBar: AppBar(
        title: const Text('Facial Verify'),
        centerTitle: true,
        leading: IconButton(
            onPressed: (() {
              Future.delayed(Duration.zero, () {
                Get.offAll(() => MyHomePage());
              });
            }),
            icon: const Icon(Icons.arrow_back)),
      ),
      body: Column(
        children: <Widget>[
          Expanded(
            child: FutureBuilder<void>(
              future: _initializeControllerFuture,
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.done) {
                  return CameraPreview(_controller);
                } else {
                  return const Center(child: CircularProgressIndicator());
                }
              },
            ),
          ),
          // Expanded(
          //   child: Container(
          //     child: Padding(
          //       padding: const EdgeInsets.all(1.0),
          //       child: Center(
          //         child: _cameraPreviewWidget(),
          //       ),
          //     ),
          //     decoration: BoxDecoration(
          //       color: Colors.black,
          //       border: Border.all(
          //         color: _controller.value.isRecordingVideo
          //             ? Colors.redAccent
          //             : Colors.grey,
          //         width: 3.0,
          //       ),
          //     ),
          //   ),
          // ),
          Padding(
            padding: const EdgeInsets.all(5.0),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.start,
              children: <Widget>[
                Expanded(
                  child: SizedBox(),
                ),
                _captureControlRowWidget(),
                Expanded(
                  child: SizedBox(),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _cameraPreviewWidget() {
    if (!_controller.value.isInitialized) {
      return Center(
        child: const Text(
          'Loading Camera',
          style: TextStyle(
            color: Colors.white,
            fontSize: 20.0,
            fontWeight: FontWeight.w900,
          ),
        ),
      );
    }

    return AspectRatio(
      aspectRatio: 16 / 9,
      child: CameraPreview(_controller),
    );
  }

  // Display the control bar with buttons to record videos.
  Widget _captureControlRowWidget() {
    return Align(
      alignment: Alignment.center,
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: <Widget>[
          // IconButton(
          //   icon: const Icon(
          //     Icons.videocam,
          //     size: 28,
          //     semanticLabel: 'Start',
          //   ),
          //   color: Colors.blue,
          //   onPressed: _onRecordButtonPressed,
          // ),
          ElevatedButton.icon(
            style: ElevatedButton.styleFrom(
              padding: EdgeInsets.all(5.0),
              backgroundColor: Colors.white,
              side: BorderSide(
                color: Colors.black,
                width: 3.0,
              ),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(15),
              ),
              elevation: 10.0,
            ),
            onPressed: _onRecordButtonPressed,
            icon: Icon(
              Icons.videocam,
              color: Colors.blue,
              size: 35.0,
            ),
            label: Container(
                margin: EdgeInsets.only(right: 8.0),
                child: Text(
                  'Start',
                  style: TextStyle(color: Colors.black),
                )),
          ),
          // IconButton(
          //   icon: const Icon(
          //     Icons.stop,
          //     size: 28,
          //     semanticLabel: 'Stop',
          //   ),
          //   color: Colors.red,
          //   onPressed: _onStopButtonPressed,
          // )
          SizedBox(width: 30),
          ElevatedButton.icon(
            style: ElevatedButton.styleFrom(
              padding: EdgeInsets.all(5.0),
              backgroundColor: Colors.white,
              side: BorderSide(
                color: Colors.black,
                width: 3.0,
              ),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(15),
              ),
              elevation: 10.0,
            ),
            onPressed: _onStopButtonPressed,
            icon: Icon(
              Icons.stop,
              color: Colors.red,
              size: 35.0,
            ),
            label: Container(
                margin: EdgeInsets.only(right: 8.0),
                child: Text(
                  'Stop',
                  style: TextStyle(color: Colors.black),
                )),
          ),
        ],
      ),
    );
  }

  String timestamp() => DateTime.now().millisecondsSinceEpoch.toString();

  void _onRecordButtonPressed() {
    print('Record button pressed');
    _startVideoRecording().then((String filePath) {
      Fluttertoast.showToast(
          msg: 'Recording video started',
          toastLength: Toast.LENGTH_SHORT,
          gravity: ToastGravity.CENTER,
          backgroundColor: Colors.grey,
          textColor: Colors.white);
    });
  }

  void _onStopButtonPressed() {
    print('Stop button pressed');
    _stopVideoRecording().then((videoPath) {
      if (mounted)
        setState(() {
          print(videoPath);
        });
      Fluttertoast.showToast(
          msg: 'Video recorded to $videoPath',
          toastLength: Toast.LENGTH_SHORT,
          gravity: ToastGravity.CENTER,
          backgroundColor: Colors.grey,
          textColor: Colors.white);
    });
  }

  Future<String> _startVideoRecording() async {
    await _initializeControllerFuture;
    if (!_controller.value.isInitialized) {
      Fluttertoast.showToast(
          msg: 'Please wait',
          toastLength: Toast.LENGTH_SHORT,
          gravity: ToastGravity.CENTER,
          backgroundColor: Colors.grey,
          textColor: Colors.white);
    }
    if (_controller.value.isRecordingVideo) {}

    // final Directory appDirectory = await getApplicationDocumentsDirectory();
    final String videoDirectory = '/sdcard/Download/Verify-Videos';
    await Directory(videoDirectory).create(recursive: true);
    final String currentTime = DateTime.now().millisecondsSinceEpoch.toString();
    filePath = '$videoDirectory/$currentTime.mp4';
    print(filePath);

    try {
      await _controller.startVideoRecording();
    } on CameraException catch (e) {
      _showCameraException(e);
    }

    return filePath;
  }

  Future<String?> _stopVideoRecording() async {
    if (!_controller.value.isRecordingVideo) {
      return null;
    }
    try {
      XFile videoFile = await _controller.stopVideoRecording();
      filePath = videoFile.path;
      videoPath = filePath;
      Get.to(() => VideoPreviewScreen(
            filePath: filePath,
            file: videoFile,
            username: widget.username,
            appID: widget.appID,
            channelID: widget.channelID,
          ));
    } on CameraException catch (e) {
      _showCameraException(e);
      return null;
    }
    return filePath;
  }

  void _showCameraException(CameraException e) {
    String errorText = 'Error: ${e.code}\nError Message: ${e.description}';
    // print(errorText);
    Fluttertoast.showToast(
        msg: 'Error: ${e.code}\n${e.description}',
        toastLength: Toast.LENGTH_SHORT,
        gravity: ToastGravity.CENTER,
        backgroundColor: Colors.red,
        textColor: Colors.white);
  }
}

class VideoPreviewScreen extends StatefulWidget {
  final String filePath;
  final XFile file;
  final String username;
  final String appID;
  final String channelID;
  VideoPreviewScreen(
      {Key? key,
      required this.filePath,
      required this.file,
      required this.username,
      required this.channelID,
      required this.appID});

  @override
  State<VideoPreviewScreen> createState() => _VideoPreviewScreenState();
}

class _VideoPreviewScreenState extends State<VideoPreviewScreen> {
  late VideoPlayerController _controller;
  late Future<void> _initializeVideoPlayerFuture;
  late var channel;
  Future<Verification>? _futureAlbum;
  String title = 'Recorded Video Preview';

  @override
  void initState() {
    super.initState();
    _controller = VideoPlayerController.file(File(widget.filePath));
    _initializeVideoPlayerFuture = _controller.initialize();
    _controller.setLooping(true);
    channel = WebSocketChannel.connect(
      Uri.parse(
          'ws://localhost:8000/ws/confirmation/' + widget.channelID + '/'),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    channel.sink.close();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(title),
        centerTitle: true,
      ),
      body: Center(
        child: SingleChildScrollView(
          child: Column(
            children: [
              (_futureAlbum == null) ? buildColumn() : buildFutureBuilder(),
            ],
          ),
        ),
      ),
    );
  }

  Column buildColumn() {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      crossAxisAlignment: CrossAxisAlignment.center,
      children: <Widget>[
        FutureBuilder(
          future: _initializeVideoPlayerFuture,
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.done) {
              return AspectRatio(
                aspectRatio: _controller.value.aspectRatio,
                child: VideoPlayer(_controller),
              );
            } else {
              return const Center(
                child: CircularProgressIndicator(),
              );
            }
          },
        ),
        SizedBox(height: 20),
        Row(mainAxisAlignment: MainAxisAlignment.spaceEvenly, children: [
          ElevatedButton.icon(
            style: ElevatedButton.styleFrom(
              padding: EdgeInsets.all(5.0),
              backgroundColor: Colors.white,
              side: BorderSide(
                color: Colors.black,
                width: 3.0,
              ),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(15),
              ),
              elevation: 10.0,
            ),
            onPressed: () {
              setState(() {
                if (_controller.value.isPlaying) {
                  _controller.pause();
                } else {
                  _controller.play();
                }
              });
            },
            icon: Icon(
              _controller.value.isPlaying ? Icons.pause : Icons.play_arrow,
              color: _controller.value.isPlaying ? Colors.red : Colors.blue,
              size: 35.0,
            ),
            label: _controller.value.isPlaying
                ? Container(
                    margin: EdgeInsets.only(right: 8.0),
                    child: Text(
                      'Pause',
                      style: TextStyle(color: Colors.black),
                    ),
                  )
                : Container(
                    margin: EdgeInsets.only(right: 8.0),
                    child: Text('Play', style: TextStyle(color: Colors.black))),
          ),
          ElevatedButton.icon(
            style: ElevatedButton.styleFrom(
              padding: EdgeInsets.all(5.0),
              backgroundColor: Colors.white,
              side: BorderSide(
                color: Colors.black,
                width: 3.0,
              ),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(15),
              ),
              elevation: 10.0,
            ),
            onPressed: (() async {
              await _controller.dispose();
              Future.delayed(Duration.zero, () {
                Get.back();
              });
            }),
            icon: Icon(
              Icons.replay,
              color: Colors.green,
              size: 35.0,
            ),
            label: Container(
                margin: EdgeInsets.only(right: 8.0),
                child: Text(
                  'Retake',
                  style: TextStyle(color: Colors.black),
                )),
          ),
          ElevatedButton.icon(
            style: ElevatedButton.styleFrom(
              padding: EdgeInsets.all(5.0),
              backgroundColor: Colors.white,
              side: BorderSide(
                color: Colors.black,
                width: 3.0,
              ),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(15),
              ),
              elevation: 10.0,
            ),
            onPressed: (() async {
              await _controller.dispose();
              // await _uploadVideo();
              setState(() {
                _futureAlbum =
                    createAlbum(widget.username, widget.appID, widget.filePath);
                title = 'Status of Verification';
              });
            }),
            icon: Icon(
              Icons.upload,
              color: Colors.blue,
              size: 35.0,
            ),
            label: Container(
                margin: EdgeInsets.only(right: 8.0),
                child: Text(
                  'Upload',
                  style: TextStyle(color: Colors.black),
                )),
          ),
        ])
      ],
    );
  }

  Future<Verification> _uploadVideo(
      String username, String appID, String filePath) async {
    File file = File(filePath);
    var request = http.MultipartRequest(
      'POST',
      Uri.parse("http://localhost:8000/api/login-face-auth"),
    );
    Map<String, String> headers = {"Content-type": "multipart/form-data"};
    request.files.add(http.MultipartFile.fromBytes(
        'face_video', file.readAsBytesSync(),
        filename: widget.filePath.split("/").last));
    request.headers.addAll(headers);
    request.fields.addAll({"app_id": appID, "username": username});
    var res = await request.send();
    var response = await http.Response.fromStream(res);
    // print("This is response:" + response.body);
    if (response.statusCode == 500 || response.statusCode == 400) {
      throw Exception('Post Request failed');
    } else {
      return Verification.fromJson(jsonDecode(response.body));
    }
  }

  Future<Verification> createAlbum(
      String username, String app_id, String filePath) async {
    return await _uploadVideo(username, app_id, filePath);
  }

  FutureBuilder<Verification> buildFutureBuilder() {
    return FutureBuilder<Verification>(
      future: _futureAlbum,
      builder: (context, snapshot) {
        if (snapshot.hasData) {
          channel.sink.add(
            jsonEncode(
              {
                "type": "chat_message",
                "message": {
                  "verified": snapshot.data!.verified,
                  "code": snapshot.data!.code,
                  "nonce_len": snapshot.data!.nonce_len,
                  "redirect_url": snapshot.data!.redirect_url,
                },
              },
            ),
          );
          channel.stream.listen(
            (data) {
              print(data);
            },
            onError: (error) => throw Exception(error),
          );
          return Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Center(
                  child: Text('Authentication successfull',
                      style: TextStyle(fontSize: 24)),
                ),
                SizedBox(height: 20),
                Center(
                  child: Text('Welcome back ${widget.username}!!!',
                      style: TextStyle(fontSize: 24)),
                ),
                SizedBox(height: 20),
                Container(
                  padding: EdgeInsets.all(10),
                  child: ElevatedButton(
                    onPressed: () {
                      Get.offAll(() => MyHomePage());
                    },
                    child: Text(
                      'Go Back',
                      style: TextStyle(fontSize: 28),
                    ),
                  ),
                ),
              ]);
        } else if (snapshot.hasError) {
          return Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Text('Failed to authenticate', style: TextStyle(fontSize: 24)),
              SizedBox(height: 20),
              Text('You are not ${widget.username}',
                  style: TextStyle(fontSize: 24)),
              Container(
                padding: EdgeInsets.all(10),
                child: ElevatedButton(
                  onPressed: () {
                    Get.offAll(() => MyHomePage());
                  },
                  child: Text(
                    'Go Back',
                    style: TextStyle(fontSize: 28),
                  ),
                ),
              ),
            ],
          );
        }
        return Center(child: const CircularProgressIndicator());
      },
    );
  }
}
