import os
import cv2
import numpy as np
import warnings
import time
import uuid

from liveliness.anti_spoof_predict import AntiSpoofPredict
from liveliness.generate_patches import CropImage
from liveliness.utility import parse_model_name

warnings.filterwarnings("ignore")


def check_image(image):
    height, width, channel = image.shape
    if width / height != 3 / 4:
        print("Image is not appropriate!!!\nHeight/Width should be 4/3.")
        return False
    else:
        return True


def make_prediction(image, model, image_cropper):
    h_input, w_input, model_type, scale = parse_model_name(model.model_name)
    param = {
        "org_img": image,
        "bbox": model.get_bbox(image),
        "scale": scale,
        "out_w": w_input,
        "out_h": h_input,
        "crop": True,
    }
    if scale is None:
        param["crop"] = False
    img = image_cropper.crop(**param)
    return model.predict(img)


def test(image, model_v1, model_v2):
    image_cropper = CropImage()
    image = cv2.resize(image, (int(image.shape[0] * 3 / 4), image.shape[0]))
    result = check_image(image)
    if result is False:
        return
    prediction = np.zeros((1, 3))
    # sum the prediction from single model's result
    pred_v1 = make_prediction(image, model_v1, image_cropper)
    pred_v2 = make_prediction(image, model_v2, image_cropper)
    prediction += pred_v1 + pred_v2
    # draw result of prediction
    label = np.argmax(prediction)
    value = prediction[0][label] / 2
    if label == 1:
        print("Prediction result: ", value, "This is a real face.")
        return True
    else:
        print("Prediction result: ", value, "This is a spoof face.")
        return False


model_dir = "./liveliness./resources/anti_spoof_models"
start = time.time()
model_v1 = AntiSpoofPredict(0, os.path.join(model_dir, os.listdir(model_dir)[0]))
model_v2 = AntiSpoofPredict(0, os.path.join(model_dir, os.listdir(model_dir)[1]))
print(f"\nLiveliness model loaded in {time.time() - start}'s\n")


def verify_liveliness(face_video):
    unikey = uuid.uuid4().hex
    with open(f"media/temp-{unikey}.mp4", "wb") as f:
        f.write(face_video.read())
    path = f"media/temp-{unikey}.mp4"
    cap = cv2.VideoCapture(path)
    true_count = 0
    false_count = 0
    counter = 0

    check_frames = []
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret or counter == 60:
            break
        counter += 1
        res = test(frame, model_v1, model_v2)
        if res:
            if counter%10 == 0:
                check_frames.append(frame)
            true_count += 1
        else:
            false_count += 1
        if cv2.waitKey(10) & 0xFF == ord("q"):
            break

    cap.release()
    os.remove(path)
    if true_count > false_count:
        print("verification successfull")
        return True, check_frames
    else:
        print("verification failed through liveliness")
        return False, []

