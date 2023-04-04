import numpy as np
import cv2
import time

import pickle
import os
import tensorflow as tf
import imutils
import uuid


model_path = "./liveliness/liveness.model"
le_path = "./liveliness/label_encoder.pickle"
detector_folder = "./liveliness/face_detector"
confidence = 0.995
args = {
    "model": model_path,
    "le": le_path,
    "detector": detector_folder,
    "confidence": confidence,
}
print("[INFO] loading face detector...")
proto_path = os.path.sep.join([args["detector"], "deploy.prototxt"])
model_path = os.path.sep.join(
    [args["detector"], "res10_300x300_ssd_iter_140000.caffemodel"]
)
start = time.time()
detector_net = cv2.dnn.readNetFromCaffe(proto_path, model_path)
liveness_model = tf.keras.models.load_model(args["model"])
# liveness_model.call = tf.function(liveness_model.call)
le = pickle.loads(open(args["le"], "rb").read())
print(f"\nLiveliness Model loaded in {time.time() - start} seconds.\n")



def preprocess_and_identify(frm, true_count, false_count, frame_count, check_frames):
    frm = imutils.resize(frm, width=int(800))
    (h, w) = frm.shape[:2]
    blob = cv2.dnn.blobFromImage(
        cv2.resize(frm, (300, 300)), 1.0, (300, 300), (104.0, 177.0, 123.0)
    )
    detector_net.setInput(blob)
    detections = detector_net.forward()
    for i in range(0, detections.shape[2]):
        confidence = detections[0, 0, i, 2]
        if confidence > args["confidence"]:
            box = detections[0, 0, i, 3:7] * np.array([w, h, w, h])
            (startX, startY, endX, endY) = box.astype("int")
            startX = max(0, startX - 20)
            startY = max(0, startY - 20)
            endX = min(w, endX + 20)
            endY = min(h, endY + 20)
            face = frm[startY:endY, startX:endX]  # for liveness detection
            try:
                face = cv2.resize(
                    face, (32, 32)
                )  # our liveness model expect 32x32 input
            except:
                break
            face = face.astype("float") / 255.0
            face = tf.keras.preprocessing.image.img_to_array(face)
            face = np.expand_dims(face, axis=0)
            
            preds = liveness_model.predict(face)[0]
            j = np.argmax(preds)
            label_name = le.classes_[j]  # get label of predicted class
            if frame_count % 10 == 0:
                check_frames.append(frm)
            if label_name == "real":
                true_count += 1
            if label_name == "fake":
                false_count += 1
    return true_count, false_count, check_frames
    pass


def verify_liveness(face_video):
    unikey = uuid.uuid4().hex
    with open(f"media/temp-{unikey}.mp4", "wb") as f:
        f.write(face_video.read())
    path = f"media/temp-{unikey}.mp4"
    cap = cv2.VideoCapture(path)
    true_count = 0
    false_count = 0
    frame_count=0
    check_frames = []
    while cap.isOpened():
        frame_count+=1
        print(frame_count)
        ret, frame = cap.read()
        if not ret:
            break
        true_count, false_count, check = preprocess_and_identify(
            frame, true_count, false_count, frame_count, check_frames
        )
        check_frames = check
        cv2.waitKey(1)
    cap.release()
    os.remove(path)
    for frame in check_frames:  
        print('frame shape', frame.shape)
    if true_count > false_count:
        print("verification successfull")
        return True, check_frames
    else:
        print("verification failed through liveliness")
        return False, []
    pass