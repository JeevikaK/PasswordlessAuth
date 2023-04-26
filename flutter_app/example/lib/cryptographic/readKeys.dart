import 'dart:io';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:example/main.dart';
import 'package:example/utils/models.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:web_socket_channel/web_socket_channel.dart';

class ReadKeys extends StatefulWidget {
  String username;
  String channel_id;
  String app_id;
  ReadKeys(
      {Key? key,
      required this.username,
      required this.app_id,
      required this.channel_id})
      : super(key: key);

  @override
  State<ReadKeys> createState() => _ReadKeysState();
}

class _ReadKeysState extends State<ReadKeys> {
  final filePath = '/sdcard/Download/keys/private.pem';
  late String fpath;
  Future<Verification>? _futureAlbum;
  bool fileExists = false;
  late var channel;

  void initState() {
    super.initState();
    channel = WebSocketChannel.connect(
      Uri.parse(
          // 'ws://10.0.2.2:8000/ws/confirmation/' + widget.channel_id + '/'),
          'ws://localhost:8000/ws/confirmation/' + widget.channel_id + '/'),
    );
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
          title: Text('Read Keys'),
          centerTitle: true,
          leading: IconButton(
            icon: Icon(Icons.arrow_back),
            onPressed: () {
              Future.delayed(Duration.zero, () {
                Get.offAll(() => MyHomePage());
              });
            },
          )),
      body: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            SizedBox(height: 20),
            (_futureAlbum == null) ? buildColumn() : buildFutureBuilder(),
          ]),
    );
  }

  String readKey(String fpath) {
    setState(() {
      fileExists = File(fpath).existsSync();
    });
    if (fileExists) {
      final privateFile = File(fpath);
      print(privateFile.readAsStringSync());
      return privateFile.readAsStringSync();
    }
    return 'Pem File does not exist';
  }

  Center buildColumn() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: <Widget>[
          Center(
            child: Container(
                padding: EdgeInsets.only(left: 15, right: 15),
                child: Text(readKey(filePath),
                    maxLines: 7, style: TextStyle(fontSize: 18))),
          ),
          SizedBox(height: 20),
          ElevatedButton(
              onPressed: () {
                setState(() {
                  _futureAlbum = createAlbum(
                      readKey(filePath), widget.username, widget.app_id);
                });
              },
              child: Text('Authenticate')),
        ],
      ),
    );
  }

  Future<Verification> createAlbum(
      String privateKey, String username, String app_id) async {
    return await postRequest(privateKey, username, app_id);
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
          return Center(
            child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  // Text(snapshot.data!.verified.toString(),
                  //     style: TextStyle(fontSize: 24)),
                  Text('Authentication successfull',
                      style: TextStyle(fontSize: 24)),
                  SizedBox(height: 20),
                  Text('Welcome back ${widget.username}',
                      style: TextStyle(fontSize: 24)),
                ]),
          );
        } else if (snapshot.hasError) {
          return Center(
              child: Column(
            children: [
              Text('Failed to authenticate', style: TextStyle(fontSize: 24)),
              SizedBox(height: 20),
              Text('You are not ${widget.username}',
                  style: TextStyle(fontSize: 24)),
            ],
          ));
        }
        return Center(child: const CircularProgressIndicator());
      },
    );
  }

  Future<Verification> postRequest(
      String privateKey, String username, String app_id) async {
    final response = await http.post(
      // Uri.parse('http://10.0.2.2:8000/api/login-inapp-auth'),
      Uri.parse('http://localhost:8000/api/login-inapp-auth'),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: jsonEncode(<String, String>{
        'private_key': utf8.decode(privateKey.codeUnits),
        'username': username,
        'app_id': app_id,
      }),
    );

    print(response.body);

    if (response.statusCode == 500 || response.statusCode == 400) {
      throw Exception('Post Request failed');
    } else {
      return Verification.fromJson(jsonDecode(response.body));
    }
  }
}
