import json
import os
import glob
import random
import numpy as np
from scipy.spatial.distance import cosine

from flask import Flask, jsonify,  Response
from fastText import FastText


app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False

PATH_TO_RECIPES = './recipes'
PATH_TO_FASTTEXT_MODEL = './wiki.ru.bin'
RECIPES = []
FASTTEXT = None

INTENTS = {
        'repeat_step': ('повтори рецепт', 'давай заново', 'прочитай снова', 'начни заново',
                        'повторим', 'еще раз', 'прочитай еще раз'),
        'step_next': ('дальше', 'я сделал', 'готово', 'давай дальше', 'следующий шаг',
                      'закончили', 'шаг вперед'),
        'step_back': ('назад', 'вернемся', "давай вернемся назад", 'шаг назад'),
        'stop_cooking': ('стоп', "остановись", "перерыв", "давай остановимся",
                         'перестань', 'хватит'),
        'unknown': None
    }


def init_list_of_recipes():
    for file in os.listdir(PATH_TO_RECIPES):
        recip_dir = os.path.join(PATH_TO_RECIPES, file)
        if os.path.isdir(recip_dir):
            for json_file in glob.glob(recip_dir+'/*.json'):
                RECIPES.append(json.load(open(json_file, 'r')))


def init_fasttext():
    global FASTTEXT
    FASTTEXT = FastText.load_model(PATH_TO_FASTTEXT_MODEL)


def get_closest_dist(text, list_of_examples):
    return np.min([cosine(FASTTEXT.get_sentence_vector(text), FASTTEXT.get_sentence_vector(item))
                   for item in list_of_examples])


@app.route('/api/get_text_intent/<text>')
def get_text_intent(text):
    min_dist, intent = 1e9, None
    for intent, examples in INTENTS.items():
        d = get_closest_dist(text, examples)
        if d < min_dist:
            min_dist, intent = d, intent
    if min_dist > 0.4:
        intent = 'unknown'
    return jsonify({'intent': intent})


@app.route('/api/get_recipes')
def get_recipes():
    return Response(json.dumps({'recipes': RECIPES}, indent=2, sort_keys=True, ensure_ascii=False),
                    content_type="application/json; charset=utf-8")


def main():
    # APP.run(host='0.0.0.0', port=80, debug=False, threaded=True)

    init_list_of_recipes()
    # init_fasttext()

    app.run(host='0.0.0.0', port=8888, debug=False, threaded=True)


if __name__ == '__main__':
    main()
