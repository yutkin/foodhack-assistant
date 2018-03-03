import json
import os
import glob

from scipy.spatial.distance import cosine

from flask import Flask, jsonify,  Response
from fastText import FastText


app = Flask(__name__)

PATH_TO_RECIPES = './recipes'
PATH_TO_FASTTEXT_MODEL = '/home/ubuntu/wiki.ru.bin'
RECIPES = []
FASTTEXT = None

INTENTS = {
    'repeat_step': ('повтори рецепт', 'давай заново', 'прочитай снова', 'начни заново', 'повторим',
                    'еще раз', 'прочитай еще раз', 'воспроизведи еще раз', 'прочитай вновь',
                    "давай по-новому"),

    'step_next': ('дальше', 'я сделал', 'готово', 'давай дальше', 'следующий шаг', 'шаг вперед',
                  'я приготовил', 'приготовленно', 'я закончил', 'закончено', "давай продолжим",
                  "продолжай"),

    'step_back': ('назад', 'вернемся', "давай вернемся назад", 'шаг назад', 'давай обратно',
                  'вернись назад'),

    'stop_cooking': ('стоп', "остановись", "перерыв", "давай остановимся", 'перестань', 'хватит',
                     'тормози', 'притормози', "кончай", "оканчивай")
}


def init_list_of_recipes():
    for file in os.listdir(PATH_TO_RECIPES):
        recip_dir = os.path.join(PATH_TO_RECIPES, file)
        if os.path.isdir(recip_dir):
            for json_file in glob.glob(recip_dir+'/*.json'):
                RECIPES.append(json.load(open(json_file, 'r')))


def init_fasttext():
    global FASTTEXT
    app.logger.info('Trying to load FastText...')
    FASTTEXT = FastText.load_model(PATH_TO_FASTTEXT_MODEL)
    app.logger.info('FastText has been loaded.')


@app.route('/api/get_text_intent/<text>')
def get_text_intent(text):
    min_dist, best_intent = 1e9, None
    text_vector = FASTTEXT.get_sentence_vector(text)
    for intent, examples in INTENTS.items():
        d = min(cosine(text_vector, FASTTEXT.get_sentence_vector(item)) for item in examples)
        if d < min_dist:
            min_dist, best_intent = d, intent
    if min_dist > 0.4 or best_intent is None:
        best_intent = 'unknown'
    return jsonify({'intent': best_intent})


@app.route('/api/get_recipes')
def get_recipes():
    return Response(json.dumps({'recipes': RECIPES}, indent=2, sort_keys=True, ensure_ascii=False),
                    content_type="application/json; charset=utf-8")


def main():
    init_list_of_recipes()
    init_fasttext()

    # app.run(host='0.0.0.0', port=8888, debug=True, threaded=False)
    app.run(host='0.0.0.0', port=8888, debug=False, threaded=True, ssl_context='adhoc')


if __name__ == '__main__':
    main()
