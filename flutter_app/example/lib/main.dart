import 'package:example/utils/read_qr.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return GetMaterialApp(
      title: 'Passwordless Auth Scanner',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: MyHomePage(),
    );
  }
}

class MyHomePage extends StatelessWidget {
  const MyHomePage({Key? key}) : super(key: key);
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Passwordless Auth Scanner'),
        centerTitle: true,
      ),
      body: Center(
          child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          ElevatedButton(
              style: ButtonStyle(
                padding: MaterialStatePropertyAll<EdgeInsetsGeometry>(
                    const EdgeInsets.all(15.0)),
                shape: MaterialStateProperty.all<RoundedRectangleBorder>(
                    RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(18.0),
                        side: const BorderSide(color: Colors.blue))),
                backgroundColor: MaterialStateProperty.all<Color>(Colors.blue),
                elevation: MaterialStateProperty.all<double>(15.0),
                shadowColor: MaterialStateProperty.all<Color>(Colors.black),
              ),
              onPressed: () {
                WidgetsBinding.instance.addPostFrameCallback((_) {
                  Get.to(() => ReadQr(
                        title: 'Read Qr',
                      ));
                });
              },
              child: const Text(
                'Scan your QR code',
                style: TextStyle(fontSize: 25),
              )),
        ],
      )),
    );
  }
}
