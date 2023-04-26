import 'package:example/biometrics/facial_verification.dart';
import 'package:example/cryptographic/readKeys.dart';
import 'package:example/biometrics/voice_verification.dart';
import 'package:flutter/material.dart';
import 'package:example/cryptographic/generateKeys.dart';
import 'package:get/get.dart';
import 'flutter_qr_bar_scanner_camera.dart';
import 'package:camera/camera.dart';

class ReadQr extends StatefulWidget {
  ReadQr({Key? key, this.title}) : super(key: key);
  final String? title;
  @override
  _ReadQrState createState() => _ReadQrState();
}

class _ReadQrState extends State<ReadQr> {
  late String? qrInfo;
  bool _camState = false;
  late CameraDescription cam;

  _qrCallback(String? code) {
    setState(() {
      _camState = false;
      qrInfo = code;
    });
  }

  _scanCode() {
    setState(() {
      _camState = true;
    });
  }

  @override
  void initState() {
    super.initState();
    _scanCode();
    initializeCamera();
  }

  @override
  void dispose() {
    super.dispose();
  }

  initializeCamera() async {
    await availableCameras().then((cameras) {
      cam = cameras[1];
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          title: Text(widget.title!),
          centerTitle: true,
        ),
        body: _camState
            ? Center(
                child: SizedBox(
                  height: 1000,
                  width: 500,
                  child: QRBarScannerCamera(
                    onError: (context, error) => Text(
                      error.toString(),
                      style: TextStyle(color: Colors.red),
                    ),
                    qrCodeCallback: (code) {
                      _qrCallback(code);
                    },
                  ),
                ),
              )
            : redirectQR(qrInfo));
  }

  Widget? redirectQR(String? qrInfo) {
    // qrInfo =
    //     'INAPP:prajumehe@gmail.com:1681415300217:38e9c4108b74437081708105c34db694:prapti:signup:facial';
    final splitted = qrInfo!.split(':');
    // final splitted = qrInfo!.split('/');
    print(splitted);
    if (splitted[splitted.length - 1] == 'video') {
      WidgetsBinding.instance.addPostFrameCallback((_) async {
        await Get.to(() => FacialVerification(
              camera: cam,
              channelID: splitted[splitted.length - 5],
              appID: splitted[splitted.length - 4],
              username: splitted[splitted.length - 3],
            ));
      });
    } else if (splitted[splitted.length - 1] == 'voice') {
      WidgetsBinding.instance.addPostFrameCallback((_) async {
        await Get.to(() => VoiceVerfication(
              channelID: splitted[splitted.length - 5],
              appID: splitted[splitted.length - 4],
              username: splitted[splitted.length - 3],
            ));
      });
    } else if (splitted[splitted.length - 1] == 'inapp' &&
            (splitted[splitted.length - 2] == 'signup' ||
                splitted[splitted.length - 2] == 're-register') ||
        splitted[splitted.length - 2] == 'recover') {
      print(splitted);
      WidgetsBinding.instance.addPostFrameCallback((_) {
        Get.to(() => GenerateKeys(
              recoveryMail: splitted[splitted.length - 6],
              channelID: splitted[splitted.length - 5],
              appID: splitted[splitted.length - 4],
              username: splitted[splitted.length - 3],
              registerType: splitted[splitted.length - 2],
            ));
      });
    } else if (splitted[splitted.length - 1] == 'inapp' &&
        splitted[splitted.length - 2] == 'login') {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        Get.to(() => ReadKeys(
            channel_id: splitted[splitted.length - 5],
            app_id: splitted[splitted.length - 4],
            username: splitted[splitted.length - 3]));
      });
    } else {
      return Center(
        child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Text('Invalid QR Code', style: TextStyle(fontSize: 30)),
              SizedBox(height: 20),
              Container(
                padding: EdgeInsets.only(top: 10),
                child:
                    Text(qrInfo, maxLines: 2, style: TextStyle(fontSize: 17)),
              )
            ]),
      );
    }
    return Center(
      child: CircularProgressIndicator(),
    );
  }
  // Future<CameraDescription> load_camera() async {
  //   await availableCameras().then((cameras) {
  //     print('camera function called');
  //     cam = cameras[1];
  //   });
  //   return cam;
  // }
}
