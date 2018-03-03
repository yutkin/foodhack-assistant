import json
import os
import glob

from flask import Flask, url_for, jsonify, g, redirect, send_from_directory

app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False

PATH_TO_RECIPES = './recipes'
RECIPES = []


def init_list_of_recipes():
    for file in os.listdir(PATH_TO_RECIPES):
        recip_dir = os.path.join(PATH_TO_RECIPES, file)
        if os.path.isdir(recip_dir):
            for json_file in glob.glob(recip_dir+'/*.json'):
                RECIPES.append(json.load(open(json_file, 'r')))
    # print(json.dumps(RECIPES, indent=4, sort_keys=True, ensure_ascii=False))


@app.route('/api/get_recipes')
def get_recipes():
    return jsonify({'recipes': RECIPES})


def main():
    # APP.run(host='0.0.0.0', port=80, debug=False, threaded=True)
    init_list_of_recipes()
    app.run(host='localhost', port=8888, debug=True, threaded=False)


if __name__ == '__main__':
    main()
