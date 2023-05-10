import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'package:example/utils/models.dart';
import 'package:http/http.dart' as http;
import 'package:example/main.dart';
import 'package:flutter/material.dart';
import 'package:flutter_sound/flutter_sound.dart';
import 'package:get/get.dart';
import 'package:intl/date_symbol_data_local.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:path/path.dart' as path;
import 'package:assets_audio_player/assets_audio_player.dart';
import 'package:intl/intl.dart' show DateFormat;
import 'package:web_socket_channel/web_socket_channel.dart';

class VoiceVerfication extends StatefulWidget {
  final String appID;
  final String username;
  final String channelID;
  VoiceVerfication(
      {Key? key,
      required this.appID,
      required this.channelID,
      required this.username})
      : super(key: key);

  @override
  _VoiceVerficationState createState() => _VoiceVerficationState();
}

class _VoiceVerficationState extends State<VoiceVerfication> {
  late FlutterSoundRecorder _myRecorder;

  final audioPlayer = AssetsAudioPlayer();
  late String filePath;
  bool _play = false;
  String _recorderTxt = '00:00:00';
  late var channel;
  Future<Verification>? _futureAlbum;
  bool _isRecording = false;
  bool _isPlaying = false;

  @override
  void initState() {
    super.initState();
    channel = WebSocketChannel.connect(
      Uri.parse(
          'ws://localhost:8000/ws/confirmation/' + widget.channelID + '/'),
    );
    startIt();
  }

  void startIt() async {
    // filePath = '/Download/temp.wav';
    // // Directory appDocDir = await getApplicationDocumentsDirectory();
    // filePath = '${appDocDir.path}/Download/temp.wav';
    new Directory('/sdcard/Download/voice_recordings')
        .create(recursive: true)
        .then((Directory directory) {
      print('Path of New Dir: ' + directory.path);
    });
    filePath = '/sdcard/Download/voice_recordings/temp.wav';
    _myRecorder = FlutterSoundRecorder();

    await _myRecorder.openAudioSession(
        focus: AudioFocus.requestFocusAndStopOthers,
        category: SessionCategory.playAndRecord,
        mode: SessionMode.modeDefault,
        device: AudioDevice.speaker);
    await _myRecorder.setSubscriptionDuration(Duration(milliseconds: 10));
    await initializeDateFormatting();

    await Permission.microphone.request();
    await Permission.storage.request();
    await Permission.manageExternalStorage.request();
  }

  @override
  void dispose() {
    _myRecorder.closeAudioSession();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
          title: Text('Verify your voice'),
          centerTitle: true,
          backgroundColor: Colors.transparent,
          elevation: 8.0,
          leading: IconButton(
            icon: Icon(Icons.arrow_back),
            onPressed: () {
              Future.delayed(Duration.zero, () {
                Get.offAll(() => MyHomePage());
              });
            },
          )),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.start,
          children: <Widget>[
            (_futureAlbum == null) ? buildColumn() : buildFutureBuilder(),
          ],
        ),
      ),
    );
  }

  ElevatedButton buildElevatedButton(
      {required IconData icon,
      required String text,
      required Color iconColor,
      required Function() f}) {
    return ElevatedButton.icon(
      style: ElevatedButton.styleFrom(
        padding: EdgeInsets.all(5.0),
        backgroundColor: Colors.white,
        side: BorderSide(
          color: Colors.orange,
          width: 3.0,
        ),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(15),
        ),
        elevation: 10.0,
      ),
      onPressed: f,
      icon: Icon(
        icon,
        color: iconColor,
        size: 35.0,
      ),
      label: Container(
          margin: EdgeInsets.only(right: 8.0),
          child: Text(
            text,
            style: TextStyle(color: Colors.black),
          )),
    );
  }

  Future<void> record() async {
    Directory dir = Directory(path.dirname(filePath));
    if (!dir.existsSync()) {
      dir.createSync();
    }
    _myRecorder.openAudioSession();
    setState(() {
      _isRecording = true;
    });
    await _myRecorder.startRecorder(
      toFile: filePath,
      codec: Codec.pcm16WAV,
    );

    StreamSubscription _recorderSubscription =
        _myRecorder.onProgress!.listen((e) {
      var date = DateTime.fromMillisecondsSinceEpoch(e.duration.inMilliseconds,
          isUtc: true);
      var txt = DateFormat('mm:ss:SS', 'en_GB').format(date);

      setState(() {
        _recorderTxt = txt.substring(0, 8);
      });
    });
    _recorderSubscription.cancel();
  }

  Future<String?> stopRecord() async {
    _myRecorder.closeAudioSession();
    setState(() {
      _isRecording = false;
    });
    return await _myRecorder.stopRecorder();
  }

  Future<void> startPlaying() async {
    setState(() {
      _isPlaying = true;
    });
    audioPlayer.open(
      Audio.file(filePath),
      autoStart: true,
      showNotification: true,
    );
    await stopPlaying();
  }

  Future<void> stopPlaying() async {
    setState(() {
      _isPlaying = false;
    });
    audioPlayer.stop();
  }

  Center buildColumn() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: <Widget>[
          Container(
            height: 400.0,
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [
                  Color.fromARGB(255, 2, 199, 226),
                  Color.fromARGB(255, 6, 75, 210)
                ],
              ),
              borderRadius: BorderRadius.vertical(
                bottom:
                    Radius.elliptical(MediaQuery.of(context).size.width, 100.0),
              ),
            ),
            child: Center(
              child: Text(
                _recorderTxt,
                style: TextStyle(fontSize: 70),
              ),
            ),
          ),
          SizedBox(
            height: 20,
          ),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget>[
              buildElevatedButton(
                icon: _isRecording ? Icons.mic_none_rounded : Icons.mic,
                iconColor: Colors.red,
                f: record,
                text: 'Record',
              ),
              SizedBox(
                width: 30,
              ),
              buildElevatedButton(
                icon: Icons.stop,
                iconColor: Colors.black,
                f: stopRecord,
                text: 'Stop',
              ),
            ],
          ),
          SizedBox(
            height: 20,
          ),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget>[
              buildElevatedButton(
                icon: _isPlaying ? Icons.pause : Icons.play_arrow,
                iconColor: Colors.black,
                f: _isPlaying ? stopPlaying : startPlaying,
                text: 'Play',
              ),
            ],
          ),
          SizedBox(
            height: 20,
          ),
          SizedBox(
            height: 20,
          ),
          buildElevatedButton(
            icon: Icons.upload_file,
            iconColor: Colors.black,
            f: () => {
              setState(() {
                _futureAlbum =
                    createAlbum(widget.username, widget.appID, filePath);
              })
            },
            text: 'Upload',
          ),
        ],
      ),
    );
  }

  Future<Verification> _uploadAudio(
      String username, String appID, String filePath) async {
    File file = File(filePath);
    var request = http.MultipartRequest(
      'POST',
      Uri.parse("http://localhost:8000/api/login-voice-auth"),
    );
    Map<String, String> headers = {"Content-type": "multipart/form-data"};
    request.files.add(http.MultipartFile.fromBytes(
        'voice_image', file.readAsBytesSync(),
        filename: filePath.split("/").last));
    request.headers.addAll(headers);
    request.fields.addAll({"app_id": appID, "username": username});
    // print("request: " + request.toString());
    var res = await request.send();
    var response = await http.Response.fromStream(res);
    print("This is response:" + response.body);
    // return res.statusCode;
    if (response.statusCode == 500 || response.statusCode == 400) {
      throw Exception('Post Request failed');
    } else {
      return Verification.fromJson(jsonDecode(response.body));
    }
  }

  Future<Verification> createAlbum(
      String username, String app_id, String filePath) async {
    return await _uploadAudio(username, app_id, filePath);
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
