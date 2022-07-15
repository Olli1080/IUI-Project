from flask import Flask, request
from flask_cors import CORS
from flask_restful import Api, Resource

import pandas as pd
import numpy as np
import math
from sklearn.neighbors import NearestNeighbors

import json
from collections import ChainMap


with open('./data/allCourses.json', 'r') as f:
    data = json.load(f)

grade_code = "01_01"
semester_code = "02"
ratings_code = "03"

def load_reg(x):
    return { x["key"] + semester_code : (int(x["regular_semester"][0]) - 1) / 5.0 }

def load_codes(x):
    return x["key"]

regular_sem = pd.Series(data=dict(ChainMap(*map(load_reg, data))))
course_codes = list(map(load_codes, data))


course_rating_codes = list()
course_grade_codes = list()
course_semester_codes = list()
course_data_codes = list()

for c in course_codes:
    course_data_codes.append(c + grade_code)
    course_data_codes.append(c + semester_code)
    course_data_codes.append(c + ratings_code)

    course_grade_codes.append(c + grade_code)
    course_semester_codes.append(c + semester_code)
    course_rating_codes.append(c + ratings_code)

def semester_rec(current, other):
    other = 0.05 + 0.95 * np.exp(-8 * (other - current))
    other[other > 1.0] = 1.0

    return other

def get_recommendations(user_data, knn, exists_all, filtered):
    current = pd.Series(user_data[0])[course_semester_codes].max()
    
    score_regular_sem = semester_rec(current, regular_sem)
    for i in score_regular_sem.index:
        score_regular_sem[i[0:2]] = score_regular_sem[i]
    score_regular_sem = score_regular_sem.drop(set(course_semester_codes).intersection(set(score_regular_sem.index)))

    distances, neighbour_users = knn.kneighbors(user_data)
    
    similarity = 1 / (distances + 1)
    temp = filtered.iloc[neighbour_users.flatten()].loc[:, exists_all.iloc[neighbour_users.flatten()].any()]
    ratings = pd.DataFrame()
    grades = pd.DataFrame()
    for i in course_codes:
        if i + grade_code in temp.columns:
            ratings[i] = temp[[i + ratings_code]]
            grades[i] = 1.0 - temp[[i + grade_code]]
            
    weighted = pd.DataFrame()
    for col in ratings.columns:
        weighted[col] = ((ratings[col] * 0.5 + grades[col] + 2.0 * score_regular_sem[col]) / 3.5).fillna(0.0).dot(similarity.T)

    existing_values = exists_all.iloc[neighbour_users.flatten()].loc[:, course_rating_codes]
    existing_values = existing_values.loc[:, existing_values.any()]

    for i in existing_values.columns:
        existing_values[i[0:2]] = existing_values[i]
    existing_values = existing_values.drop(set(course_rating_codes).intersection(set(existing_values.columns)), axis=1)

    norm_factor = pd.DataFrame()
    existing_values = existing_values.replace(False, 0.0).replace(True, 1.0)
    for col in existing_values.columns:
        norm_factor[col] = existing_values[col].fillna(0.0).dot(similarity.T)

    reasoning = dict()
    for i in set(course_grade_codes).intersection(set(temp.columns)):
        reasoning[i[0:2]] = { "grades": {}}
        for index, value in temp.loc[:, i].value_counts().iteritems():
            reasoning[i[0:2]]["grades"][((index * 4) + 1)] = value

    for i in set(course_rating_codes).intersection(set(temp.columns)):
        reasoning[i[0:2]]["ratings"] = {}
        for index, value in temp.loc[:, i].value_counts().iteritems():
            reasoning[i[0:2]]["ratings"][(int(index * 2))] = value

    results = (weighted / norm_factor).iloc[0].sort_values(ascending=False)
    return results, reasoning, similarity

def get_classifier():
    temp = course_data_codes + ["FINISHED"]
    data = pd.read_csv('./data/data_tutorial316936_2022-07-15_20-21.csv', encoding = "ISO-8859-1")

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
        exists[i] = filtered[[i + grade_code, i + semester_code, i + ratings_code]].any(axis=1)
        exists_all[i + grade_code] = exists[i]
        exists_all[i + semester_code] = exists[i]
        exists_all[i + ratings_code] = exists[i]

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
        c_grade = str(c) + grade_code
        c_semester = str(c) + semester_code
        c_like = str(c) + ratings_code
        filtered[c_grade] = filtered[c_grade].map(grade)
        filtered[c_semester] = filtered[c_semester].map(semester)
        filtered[c_like] = filtered[c_like].map(like)

    semesters = filtered.loc[:, course_semester_codes]

    def fill_reg_max(x):
        m = x.max()
        cp = regular_sem.copy()
        cp[cp < m] = m

        x[x.isna()] = cp[x.isna()]
        
        return x

    fi = filtered.copy()
    fi.loc[:, course_semester_codes] = semesters.apply(fill_reg_max, axis=1)
    fi = fi.fillna(0.5)
    
    knn = NearestNeighbors(n_neighbors=5)
    knn.fit(fi)
    return lambda user_data: get_recommendations(user_data, knn, exists_all, filtered)

def pr_sem(sem):
    if sem == 0:
        return 1.0
    return (int(sem) - 1) / 5.0

def pr_like(like):
    return (2 - like) / 2.0

def pr_grade(grade):
    return (grade - 1.0) / 4.0

def process_input(x):
    df = pd.Series(index=course_data_codes, dtype=np.float64)
    for c in x:
        df[c["course"] + grade_code] = pr_grade(float(c["grade"]))
        df[c["course"] + semester_code] = pr_sem(int(c["semester"]))
        df[c["course"] + ratings_code] = pr_like(int(c["like"]))

    df[course_semester_codes] = df[course_semester_codes].max()
    df = df.fillna(0.5)
    return df

def process_output(df, reasoning, similarity):
    out = dict()
    out["similarity"] = { "max": similarity.max(), "avg": similarity.mean(), "min": similarity.min()}
    out["recommendations"] = dict()
    for index, value in df.items():
        out["recommendations"][index] = {"score": value, "reasoning": reasoning[index]}
    return out

classifier = get_classifier()

def main():
    app = Flask(__name__)
    CORS(app)
    api = Api(app)
    api.add_resource(Recommendations, "/userdata")
    api.add_resource(CourseData, "/course_data")
    app.run(debug=True)


class Recommendations(Resource):
    
    def put(self):
        recs, reasoning, similarity = classifier([process_input(request.json)])
        
        # filter out passed modules
        dropper = set(recs.index.to_list()).intersection(list(map(lambda x: x["course"], list(filter(lambda x: x["grade"] != "5.0", request.json)))))
        recs = recs.drop(dropper)

        for k in dropper:
            reasoning.pop(k, None)

        out = process_output(recs, reasoning, similarity)
        return out


class CourseData(Resource):
    def get(self):
        with open("./data/allCourses.json") as course_file:
            course_data = json.load(course_file)
        return course_data


if __name__ == "__main__":
    main()
