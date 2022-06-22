import json
import time

from flask import Flask, request
from flask_cors import CORS
from flask_restful import Api, Resource

import pandas as pd
import numpy as np
import math
from sklearn.neighbors import NearestNeighbors

course_codes = ["KP", "RR", "AI", "A2", "BS", "TI", "T2", "PV", "P2", "MM", "DS", "D2", "SE", "KI", "CB", "HC", "H2", "IT", "CG", "ES", "RI", "CS", "GD", "FP", "DL", "PR", "BP", "SR", "BA", "K1", "IU"]

course_rating_codes = list()
course_grade_codes = list()
course_semester_codes = list()
course_data_codes = list()

for c in course_codes:
    course_data_codes.append(c + "01_01")
    course_data_codes.append(c + "02")
    course_data_codes.append(c + "03")

    course_grade_codes.append(c + "01_01")
    course_semester_codes.append(c + "02")
    course_rating_codes.append(c + "03")

def get_recommendations(user_data, knn, exists_all, filtered):
    distances, neighbour_users = knn.kneighbors(user_data)
    
    similarity = 1 / (distances + 1)
    temp = filtered.iloc[neighbour_users.flatten()].loc[:, exists_all.iloc[neighbour_users.flatten()].any()]
    temp2 = pd.DataFrame()
    for i in course_codes:
        if i + "01_01" in temp.columns:
            temp2[i] = temp[[i + "03"]]
    qwe = pd.DataFrame()
    for col in temp2.columns:
        qwe[col] = temp2[col].fillna(0.0).dot(similarity.T)

    a = exists_all.iloc[neighbour_users.flatten()].loc[:, course_rating_codes]
    a = a.loc[:, a.any()]
    for i in a.columns:
        a[i[0:2]] = a[i]
    a = a.drop(set(course_rating_codes).intersection(set(a.columns)), axis=1)

    asdf = pd.DataFrame()
    a = a.replace(False, 0.0).replace(True, 1.0)
    for col in a.columns:
        asdf[col] = a[col].fillna(0.0).dot(similarity.T)

    results = (qwe / asdf).iloc[0].sort_values(ascending=False)
    return results

def get_classifier():
    temp = course_data_codes + ["FINISHED"]
    data = pd.read_csv('./data/data_tutorial316936_2022-06-15_10-39.csv', encoding = "ISO-8859-1")

    filtered = pd.DataFrame()
    for i in temp:
        if i in data.columns:
            filtered[i] = data[i]
        else:
            filtered[i] = np.NAN

    filtered = filtered.loc[filtered["FINISHED"] == "1"].drop(["FINISHED"], axis=1)

    exists = pd.DataFrame()
    exists_all = pd.DataFrame()
    for i in course_codes:
        exists[i] = filtered[[i + "01_01", i + "02", i + "03"]].any(axis=1)
        exists_all[i + "01_01"] = exists[i]
        exists_all[i + "02"] = exists[i]
        exists_all[i + "03"] = exists[i]

    grades = [1.0, 1.3, 1.7, 2.0, 2.3, 2.7, 3.0, 3.3, 3.7, 4.0, 5.0]

    def grade(i):
        if math.isnan(float(i)) or i == "-9":
            return np.NAN
        return (grades[int(i) - 1] - 1.0) / 4.0
        
    def semester(i):
        if math.isnan(float(i)) or i == "-9":
            return np.NAN
        return (int(i) - 1) / 5.0

    def like(i):
        if math.isnan(float(i)) or i == "-9":
            return np.NAN
        return (int(i) - 1) / 2

    for c in course_codes:
        c_grade = str(c) + "01_01"
        c_semester = str(c) + "02"
        c_like = str(c) + "03"
        filtered[c_grade] = filtered[c_grade].map(grade)
        filtered[c_semester] = filtered[c_semester].map(semester)
        filtered[c_like] = filtered[c_like].map(like)

    semesters = filtered.loc[:, course_semester_codes]
    filtered.loc[:, course_semester_codes] = semesters.T.fillna(semesters.max(axis=1)).T

    fi = filtered.fillna(0.5)
    knn = NearestNeighbors(n_neighbors=4)
    knn.fit(fi)
    return lambda user_data: get_recommendations(user_data, knn, exists_all, filtered)

def pr_sem(sem):
    if sem == 0:
        return 1.0
    return (sem - 1) / 5.0

def pr_like(like):
    return (2 - like) / 2.0

def pr_grade(grade):
    return (grade - 1.0) / 4.0

def process_input(x):
    df = pd.Series(index=course_data_codes, dtype=np.float64)
    for c in x:
        df[c["course"] + "01_01"] = pr_grade(float(c["grade"]))
        df[c["course"] + "02"] = pr_sem(int(c["semester"]))
        df[c["course"] + "03"] = pr_like(int(c["like"]))

    df[course_semester_codes] = df[course_semester_codes].max()
    df = df.fillna(0.5)
    return df

def process_output(df):
    out = list()
    for index, value in df.items():
        out.append({"course": index, "score": value})
    return out

classifier = get_classifier()

def main():
    app = Flask(__name__)
    CORS(app)
    api = Api(app)
    api.add_resource(Recommendations, "/userdata")
    app.run(debug=True)


class Recommendations(Resource):
    
    def put(self):
        # Do something with user data
        #print(request.json)
        recs = classifier([process_input(request.json)])
        
        #print(list(map(lambda x: x["course"], list(filter(lambda x: x["grade"] != "5.0", request.json)))))

        #filter out passed modules
        dropper = set(recs.index.to_list()).intersection(list(map(lambda x: x["course"], list(filter(lambda x: x["grade"] != "5.0", request.json)))))
        recs = recs.drop(dropper)

        out = process_output(recs)
        #print(out)

        #with open('./recommendations/recommendations.json') as test_data:
         #   test_recommendations = json.load(test_data)
        #time.sleep(5)
        #return test_recommendations
        return out


if __name__ == "__main__":
    main()
