from flask import Flask, jsonify, request
from flask_cors import CORS
from joblib import dump, load
from xgboost import XGBRegressor
import json
import random
import pandas as pd

clf = XGBRegressor()
clf.load_model("xg_reg.json")
x_data = pd.read_csv("features_test.csv").head(1)
if "Unnamed: 0" in x_data.columns: x_data = x_data.drop("Unnamed: 0", axis=1)
prediction = clf.predict(x_data)
#print(prediction)

def convert_dataset_to_featureset(data):
    columns = data.columns
    
    # All artists IDs start with a number
    artists = list(filter(lambda x: x[0].isnumeric(), columns))
    song_features = list(filter(lambda x: not(x[0].isnumeric()), columns))
    
    # Drop "Unnamed 0" - dummy index
    if "Unnamed: 0" in song_features: song_features.remove("Unnamed: 0")

    features_list = []
    
    # All numeric features
    for feature in song_features:
        minimum = data[feature].min()
        maximum = data[feature].max()
        current = str(x_data[feature])
        normalized = False
        
        if data[feature].min() >= 0 and data[feature].max() <= 1:
            normalized = True
            
        
        data_type =  str(data[feature].dtype)
        if data_type == "int64":
            minimum = int(minimum)
            maximum = int(maximum)
            current = int(x_data[feature])
        elif data_type == "float32" or data_type == "float64":
            minimum = float(minimum)
            maximum = float(maximum)
            current = float(x_data[feature])

        features_list.append({"name": feature, "type": data_type, "values": { "min": minimum, "max": maximum, "normalized": normalized, "current": current}})
    
    features_list.append({"name": "artists", "type": "dummy", "values": { "selection": artists}})
    
    return features_list



app = Flask(__name__)
CORS(app)



X_train = pd.read_csv("features_test.csv")
features_list = convert_dataset_to_featureset(X_train)

@app.route("/get_features", methods=['GET'])
def features():    
    json_response = jsonify({"features": features_list})
    return json_response

@app.route("/", methods=['GET'])
def index():
    global x_data;
    try:
        args = request.args.items()
        print(x_data.columns)
        #print(args)
        for key, value in args:
            x_data[key] = pd.to_numeric(value)
            # Sometimes buggy
            if "features" in x_data.columns: x_data = x_data.drop("features", axis=1)
            if "prediction" in x_data.columns: x_data = x_data.drop("prediction", axis=1)
        prediction = clf.predict(x_data)[0]
        json_response = jsonify({"prediction": int(prediction)})
        return json_response
    except:
        print("Exception!")
        return jsonify({"prediction": 0})

if __name__ == '__main__':
    app.run(debug=True)