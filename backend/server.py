import json
import time

from flask import Flask, request
from flask_cors import CORS
from flask_restful import Api, Resource


def main():
    app = Flask(__name__)
    CORS(app)
    api = Api(app)
    api.add_resource(Recommendations, "/userdata")
    app.run(debug=True)


class Recommendations(Resource):
    def put(self):
        # Do something with user data
        print(request.json)
        with open('../frontend/src/data/recommendations.json') as test_data:
            test_recommendations = json.load(test_data)
        time.sleep(5)
        return test_recommendations


if __name__ == "__main__":
    main()
