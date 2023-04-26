class PostResponse {
  final String username;
  final String status;
  final String code;
  final int nonce_len;
  final String redirect_url;

  const PostResponse(
      {required this.username,
      required this.status,
      required this.code,
      required this.nonce_len,
      required this.redirect_url});

  factory PostResponse.fromJson(Map<String, dynamic> json) {
    return PostResponse(
        username: json['username'],
        status: json['status'],
        code: json['code'],
        nonce_len: json['nonce_len'],
        redirect_url: json['redirect_url']);
  }
}

class Verification {
  final bool verified;
  final String code;
  final int nonce_len;
  final String redirect_url;

  const Verification(
      {required this.verified,
      required this.code,
      required this.nonce_len,
      required this.redirect_url});

  factory Verification.fromJson(Map<String, dynamic> json) {
    return Verification(
        verified: json['verified'],
        code: json['code'],
        nonce_len: json['nonce_len'],
        redirect_url: json['redirect_url']);
  }
}

class GetResponse {
  final bool userExists;
  final bool face_auth;
  final bool voice_auth;
  final bool inapp_auth;
  final bool fido_auth;

  const GetResponse(
      {required this.userExists,
      required this.face_auth,
      required this.voice_auth,
      required this.inapp_auth,
      required this.fido_auth});
  factory GetResponse.fromJson(Map<String, dynamic> json) {
    return GetResponse(
        userExists: json['userExists'],
        face_auth: json['face_auth'],
        voice_auth: json['voice_auth'],
        inapp_auth: json['inapp_auth'],
        fido_auth: json['fido_auth']);
  }
}

class ReRegisterResponse {
  final String status;

  const ReRegisterResponse({required this.status});
  factory ReRegisterResponse.fromJson(Map<String, dynamic> json) {
    return ReRegisterResponse(
      status: json['status'],
    );
  }
}

class RecoveryResponse {
  final String recovery_token;
  final String status;

  const RecoveryResponse({
    required this.status,
    required this.recovery_token,
  });

  factory RecoveryResponse.fromJson(Map<String, dynamic> json) {
    return RecoveryResponse(
        status: json['status'], recovery_token: json['recovery_token']);
  }
}
