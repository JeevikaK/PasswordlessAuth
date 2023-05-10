import 'dart:ui';

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
        flexibleSpace: Container(
          decoration: const BoxDecoration(
              gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [
                Color.fromRGBO(31, 41, 55, 1),
                Color.fromRGBO(31, 41, 55, 1),
              ])),
        ),
        title: const Text('Passwordless Auth Scanner'),
        centerTitle: true,
      ),
      body: Container(
        decoration: const BoxDecoration(
            gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
              Colors.black,
              Colors.black,
            ])),
        child: Center(
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
                          side: const BorderSide(color: Colors.black))),
                  backgroundColor: MaterialStateProperty.all<Color>(
                      Color.fromRGBO(31, 41, 55, 0.7)),
                  elevation: MaterialStateProperty.all<double>(8.0),
                  shadowColor: MaterialStateProperty.all<Color>(
                      Color.fromARGB(255, 109, 138, 152)),
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
            // Center(
            //   child: ClipRRect(
            //     borderRadius: BorderRadius.circular(20),
            //     child: Container(
            //       child: Stack(children: [
            //         BackdropFilter(
            //           filter: ImageFilter.blur(
            //             sigmaX: 7,
            //             sigmaY: 7,
            //           ),
            //           child: Container(
            //             height: 220,
            //             width: 360,
            //           ),
            //         ),
            //         Container(
            //           height: 230,
            //           width: 360,
            //           decoration: BoxDecoration(
            //               boxShadow: [
            //                 BoxShadow(
            //                   color: Colors.black.withOpacity(0.25),
            //                 )
            //               ],
            //               border: Border.all(
            //                   color: Colors.white.withOpacity(0.2), width: 1.0),
            //               gradient: LinearGradient(
            //                 colors: [
            //                   Colors.white.withOpacity(0.5),
            //                   Colors.white.withOpacity(0.2)
            //                 ],
            //                 stops: [0.0, 1.0],
            //               ),
            //               borderRadius: BorderRadius.circular(20)),
            //           child: Padding(
            //             padding: const EdgeInsets.all(20.0),
            //             child: ElevatedButton(
            //                 style: ButtonStyle(
            //                   // padding:
            //                   //     MaterialStatePropertyAll<EdgeInsetsGeometry>(
            //                   //         const EdgeInsets.all(15.0)),
            //                   // shape: MaterialStateProperty.all<
            //                   //         RoundedRectangleBorder>(
            //                   //     RoundedRectangleBorder(
            //                   //         borderRadius: BorderRadius.circular(18.0),
            //                   //         side: const BorderSide(
            //                   //             color: Colors.blue))),
            //                   backgroundColor: MaterialStateProperty.all<Color>(
            //                       Colors.white.withOpacity(0.1)),
            //                   elevation:
            //                       MaterialStateProperty.all<double>(15.0),
            //                   shadowColor: MaterialStateProperty.all<Color>(
            //                       Colors.black),
            //                 ),
            //                 onPressed: () {
            //                   WidgetsBinding.instance.addPostFrameCallback((_) {
            //                     Get.to(() => ReadQr(
            //                           title: 'Read Qr',
            //                         ));
            //                   });
            //                 },
            //                 child: const Text(
            //                   'Scan your QR code',
            //                   style: TextStyle(fontSize: 25),
            //                 )),
            //           ),
            //         ),
            //       ]),
            //     ),
            //   ),
            // )
          ],
        )),
      ),
    );
  }

  Widget frostedGlassEffectDemo(BuildContext context) {
    return Center(
      child: ClipRRect(
        borderRadius: BorderRadius.circular(20),
        child: Container(
          child: Stack(children: [
            BackdropFilter(
              filter: ImageFilter.blur(
                sigmaX: 7,
                sigmaY: 7,
              ),
              child: Container(
                height: 220,
                width: 360,
              ),
            ),
            Container(
              height: 230,
              width: 360,
              decoration: BoxDecoration(
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.25),
                    )
                  ],
                  border: Border.all(
                      color: Colors.white.withOpacity(0.2), width: 1.0),
                  gradient: LinearGradient(
                    colors: [
                      Colors.white.withOpacity(0.5),
                      Colors.white.withOpacity(0.2)
                    ],
                    stops: [0.0, 1.0],
                  ),
                  borderRadius: BorderRadius.circular(20)),
              child: Padding(
                padding: const EdgeInsets.all(20.0),
                child: ElevatedButton(
                    style: ButtonStyle(
                      padding: MaterialStatePropertyAll<EdgeInsetsGeometry>(
                          const EdgeInsets.all(15.0)),
                      shape: MaterialStateProperty.all<RoundedRectangleBorder>(
                          RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(18.0),
                              side: const BorderSide(color: Colors.blue))),
                      backgroundColor:
                          MaterialStateProperty.all<Color>(Colors.blue),
                      elevation: MaterialStateProperty.all<double>(15.0),
                      shadowColor:
                          MaterialStateProperty.all<Color>(Colors.black),
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
              ),
            ),
          ]),
        ),
      ),
    );
  }
}
