import 'dart:core';
import 'dart:math';
import 'dart:io';
import 'dart:typed_data';
import 'package:example/main.dart';
import 'package:example/utils/models.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:pointycastle/export.dart' as exp;
import 'package:pointycastle/pointycastle.dart';
import 'package:example/utils/rsa_helper.dart';
import 'package:path/path.dart' as path;
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:web_socket_channel/web_socket_channel.dart';

late String pb;
late String pr;

class GenerateKeys extends StatefulWidget {
  String username;
  String appID;
  String channelID;
  String? recoveryMail;
  String registerType;
  GenerateKeys(
      {Key? key,
      required this.registerType,
      required this.username,
      required this.appID,
      required this.channelID,
      this.recoveryMail})
      : super(key: key);

  @override
  State<GenerateKeys> createState() => _GenerateKeysState();
}

class _GenerateKeysState extends State<GenerateKeys> {
  Future<PostResponse>? _signUpAlbum;
  Future<ReRegisterResponse>? _reRegisterAlbum;
  Future<RecoveryResponse>? recoveryAlbum;
  List<Widget> list = [];
  late String filePath;
  late var channel;

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
    new Directory('/sdcard/Download/keys')
        .create(recursive: true)
        .then((Directory directory) {
      print('Path of New Dir: ' + directory.path);
    });
    filePath = '/sdcard/Download/keys/private.pem';
  }

  @override
  void dispose() {
    channel.sink.close();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
          title: Text('Generate Keys'),
          centerTitle: true,
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
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            widget.registerType == 'signup'
                ? ((_signUpAlbum == null)
                    ? buildColumn()
                    : signUpFutureBuilder())
                : widget.registerType == 'recovery'
                    ? ((_reRegisterAlbum == null)
                        ? buildColumn()
                        : recoveryFutureBuilder())
                    : (_reRegisterAlbum == null)
                        ? buildColumn()
                        : reRegisterFutureBuilder(),
          ],
        ),
      ),
    );
  }

  Future<void> generateKeys(String fpath) async {
    var keyParams = RSAKeyGeneratorParameters(BigInt.from(65537), 512, 5);
    var secureRandom = exp.FortunaRandom();
    var random = Random.secure();
    List<int> seeds = [];
    for (int i = 0; i < 32; i++) {
      seeds.add(random.nextInt(255));
    }
    secureRandom.seed(KeyParameter(Uint8List.fromList(seeds)));
    var rngParams = ParametersWithRandom(keyParams, secureRandom);
    var k = exp.RSAKeyGenerator();
    k.init(rngParams);
    var keyPair = k.generateKeyPair();
    pb = RsaKeyHelper()
        .encodePublicKeyToPem(keyPair.publicKey as RSAPublicKey)
        .toString();
    pr = RsaKeyHelper()
        .encodePrivateKeyToPem(keyPair.privateKey as RSAPrivateKey)
        .toString();

    Directory dir = Directory(path.dirname(fpath));
    print(dir);
    if (!dir.existsSync()) {
      dir.createSync();
    }
    final privateFile = File(fpath);
    privateFile.writeAsStringSync(
        RsaKeyHelper()
            .encodePrivateKeyToPem(keyPair.privateKey as RSAPrivateKey),
        flush: true,
        mode: FileMode.write);

    print(RsaKeyHelper()
        .encodePrivateKeyToPem(keyPair.privateKey as RSAPrivateKey));

    // const data = 'hello';
    // final signer = exp.RSASigner(exp.SHA256Digest(), '');
    // signer.init(true, PrivateKeyParameter<RSAPrivateKey>(keyPair.privateKey));
    // final signature =
    //     signer.generateSignature(Uint8List.fromList(data.codeUnits));

    // AsymmetricKeyParameter<RSAPublicKey> keyParametersPublic =
    //     PublicKeyParameter(keyPair.publicKey);
    // var cipher = exp.RSAEngine()..init(true, keyParametersPublic);

    // var cipherText =
    //     cipher.process(Uint8List.fromList("Hello World".codeUnits));

    // AsymmetricKeyParameter<RSAPrivateKey> keyParametersPrivate =
    //     PrivateKeyParameter(keyPair.privateKey);

    // cipher.init(false, keyParametersPrivate);
    // var decrypted = cipher.process(cipherText);
  }

  Expanded buildColumn() {
    return Expanded(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.start,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: <Widget>[
          ElevatedButton(
              onPressed: () {
                setState(() {
                  generateKeys(filePath);
                  list.add(Text(
                    pr.toString(),
                    maxLines: 5,
                    style: TextStyle(fontSize: 18),
                  ));
                  widget.registerType == 'signup'
                      ? _signUpAlbum = createSignUpAlbum(pb, widget.username,
                          widget.appID, widget.recoveryMail!)
                      : widget.registerType == 'recovery'
                          ? recoveryAlbum = createRecoveryAlbum(
                              pb,
                              widget.username,
                              widget.appID,
                              widget.recoveryMail!)
                          : _reRegisterAlbum = createReRegisterAlbum(
                              pb, widget.username, widget.appID);
                });
              },
              child: Text('Generate Public and Private Keys'))
        ],
      ),
    );
  }

  Future<PostResponse> createSignUpAlbum(String publicKey, String username,
      String appID, String recoveryMail) async {
    getRequest(username);
    return await postRequest(publicKey, username, appID, recoveryMail);
  }

  Future<RecoveryResponse> createRecoveryAlbum(String publicKey,
      String username, String appID, String recoveryMail) async {
    getRequest(username);
    return await recoveryRequest(publicKey, recoveryMail);
  }

  Future<ReRegisterResponse> createReRegisterAlbum(
      String publicKey, String username, String appID) async {
    return await reRegisterRequest(publicKey, username, appID);
  }

  FutureBuilder<PostResponse> signUpFutureBuilder() {
    return FutureBuilder<PostResponse>(
      future: _signUpAlbum,
      builder: (context, snapshot) {
        if (snapshot.hasData) {
          channel.sink.add(
            jsonEncode(
              {
                "type": "chat_message",
                "message": {
                  "status": snapshot.data!.status,
                  "username": snapshot.data!.username,
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
            onError: (error) => print(error),
          );
          return Center(
            child: Column(children: [
              Text('Sign-Up successful', style: TextStyle(fontSize: 20)),
              Text('Welcome back ${snapshot.data!.username}!!!',
                  style: TextStyle(fontSize: 20)),
            ]),
          );
        } else if (snapshot.hasError) {
          print(snapshot.error.toString());
          return Center(
              child: Text('Error in SignUp', style: TextStyle(fontSize: 20)));
        }
        return Center(child: const CircularProgressIndicator());
      },
    );
  }

  FutureBuilder<ReRegisterResponse> reRegisterFutureBuilder() {
    return FutureBuilder<ReRegisterResponse>(
      future: _reRegisterAlbum,
      builder: (context, snapshot) {
        if (snapshot.hasData) {
          channel.sink.add(
            jsonEncode(
              {
                "type": "chat_message",
                "message": {
                  "status": snapshot.data!.status,
                },
              },
            ),
          );
          channel.stream.listen(
            (data) {
              print(data);
            },
            onError: (error) => print(error),
          );
          return Center(
            child: Column(children: [
              Text('Re-Registration ${snapshot.data!.status.toString()}',
                  style: TextStyle(fontSize: 20)),
            ]),
          );
        } else if (snapshot.hasError) {
          print(snapshot.error.toString());
          return Center(
              child: Text('Error in Re-registration',
                  style: TextStyle(fontSize: 20)));
        }
        return Center(child: const CircularProgressIndicator());
      },
    );
  }

  FutureBuilder<RecoveryResponse> recoveryFutureBuilder() {
    return FutureBuilder<RecoveryResponse>(
      future: recoveryAlbum,
      builder: (context, snapshot) {
        if (snapshot.hasData) {
          channel.sink.add(
            jsonEncode(
              {
                "type": "chat_message",
                "message": {
                  "status": snapshot.data!.status,
                  "recovery_mail": snapshot.data!.recovery_token,
                },
              },
            ),
          );
          channel.stream.listen(
            (data) {
              print(data);
            },
            onError: (error) => print(error),
          );
          return Center(
            child: Column(children: [
              Text('Recovery ${snapshot.data!.status.toString()}',
                  style: TextStyle(fontSize: 20)),
            ]),
          );
        } else if (snapshot.hasError) {
          print(snapshot.error.toString());
          return Center(
              child: Text('Error in Recovery', style: TextStyle(fontSize: 20)));
        }
        return Center(child: const CircularProgressIndicator());
      },
    );
  }

  void getRequest(String username) async {
    final response = await http.get(
      // Uri.parse('http://10.0.2.2:8000/api/get_user/$username'),
      Uri.parse('http://localhost:8000/api/get_user/$username'),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
      },
    );
    print(response.body);
    if (GetResponse.fromJson(jsonDecode(response.body)).userExists &&
        GetResponse.fromJson(jsonDecode(response.body)).inapp_auth) {
      throw Exception('User already exists');
    }
  }

  Future<PostResponse> postRequest(String publicKey, String username,
      String appID, String recoveryMail) async {
    print(appID);
    final response = await http.post(
      // Uri.parse('http://10.0.2.2:8000/api/signup-inapp-auth'),
      Uri.parse('http://localhost:8000/api/signup-inapp-auth'),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: jsonEncode(<String, String>{
        'public_key': utf8.decode(publicKey.codeUnits),
        'username': username,
        'app_id': appID,
        'recovery_email': recoveryMail,
      }),
    );
    if (response.statusCode == 500 || response.statusCode == 400) {
      throw Exception('Post Request Failed');
    } else {
      return PostResponse.fromJson(jsonDecode(response.body));
    }
  }

  Future<ReRegisterResponse> reRegisterRequest(
    String publicKey,
    String username,
    String appID,
  ) async {
    final response = await http.post(
      // Uri.parse('http://10.0.2.2:8000/api/signup-inapp-auth'),
      Uri.parse('http://localhost:8000/api/signup-inapp-auth'),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: jsonEncode(<String, String>{
        'public_key': utf8.decode(publicKey.codeUnits),
        'username': username,
        'app_id': appID,
      }),
    );
    if (response.statusCode == 500 || response.statusCode == 400) {
      throw Exception('Post Request Failed');
    } else {
      return ReRegisterResponse.fromJson(jsonDecode(response.body));
    }
  }

  Future<RecoveryResponse> recoveryRequest(
      String publicKey, String recoveryToken) async {
    final response = await http.post(
      // Uri.parse('http://10.0.2.2:8000/api/signup-inapp-auth'),
      Uri.parse('http://localhost:8000/api/signup-inapp-auth'),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: jsonEncode(<String, String>{
        'public_key': utf8.decode(publicKey.codeUnits),
        'recovery_token': recoveryToken,
      }),
    );
    if (response.statusCode == 500 || response.statusCode == 400) {
      throw Exception('Post Request Failed');
    } else {
      return RecoveryResponse.fromJson(jsonDecode(response.body));
    }
  }
}
