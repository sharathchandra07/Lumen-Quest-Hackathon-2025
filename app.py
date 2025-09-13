import pickle
import pandas as pd
from flask import Flask, request, jsonify, render_template
import warnings
warnings.filterwarnings("ignore", category=UserWarning)

with open('model/preprocess.pkl', 'rb') as f:
    preprocess = pickle.load(f)

encoder = preprocess['encoder']
df_features_final = preprocess['df_features_final']
merged_df = preprocess['df']
user_plan_matrix = preprocess['user_plan_matrix']

from sklearn.metrics.pairwise import cosine_similarity
from sklearn.neighbors import NearestNeighbors

similarity_matrix = cosine_similarity(df_features_final)
model_cf = NearestNeighbors(metric='cosine', algorithm='brute')
model_cf.fit(user_plan_matrix)

def content_based_recommend_full(plan_index, top_n=5):
    sim_scores = list(enumerate(similarity_matrix[plan_index]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    sim_scores = sim_scores[1:top_n+1]
    recommended = merged_df.iloc[[i[0] for i in sim_scores]][
        ['Subscription Id', 'Subscription Type', 'amount', 'Price']
    ]
    return recommended.reset_index(drop=True)

def cf_recommend_full(user_id, top_n=5):
    # Ensure user_id is int and exists
    try:
        user_id = int(user_id)
    except Exception:
        raise KeyError(f"user_id {user_id} is not a valid integer")
    if user_id not in user_plan_matrix.index:
        raise KeyError(f"user_id {user_id} not found in user_plan_matrix index")
    distances, indices = model_cf.kneighbors(
        user_plan_matrix.loc[user_id].values.reshape(1, -1),
        n_neighbors=top_n+1
    )
    similar_users = indices.flatten()[1:]
    recommended_plans_ids = user_plan_matrix.iloc[similar_users].sum().sort_values(ascending=False).head(top_n).index
    recommended = merged_df[merged_df['Subscription Type'].isin(recommended_plans_ids)][
        ['Subscription Id', 'Subscription Type', 'amount', 'Price']
    ].drop_duplicates(subset='Subscription Id').reset_index(drop=True)
    return recommended

def hybrid_recommend_full(user_id, plan_index, top_n=5):
    content_recs = content_based_recommend_full(plan_index, top_n=top_n)
    cf_recs = cf_recommend_full(user_id, top_n=top_n)
    hybrid_df = pd.concat([content_recs, cf_recs]).drop_duplicates(subset='Subscription Id')
    return hybrid_df.head(top_n).reset_index(drop=True)

app = Flask(__name__)


# Home page with form
@app.route('/', methods=['GET', 'POST'])
def home():
    results = None
    error = None
    if request.method == 'POST':
        user_id = request.form.get('user_id')
        plan_index = request.form.get('plan_index')
        top_n = request.form.get('top_n', 5)
        try:
            top_n = int(top_n)
            result = hybrid_recommend_full(user_id, int(plan_index), top_n)
            results = result.to_dict(orient="records")
        except Exception as e:
            error = str(e)
    return render_template('index.html', results=results, error=error)


# API endpoint for JSON requests (unchanged)
@app.route('/recommend', methods=['POST'])
def recommend():
    if request.is_json:
        data = request.get_json()
        user_id = data.get('user_id')
        plan_index = data.get('plan_index')
        top_n = data.get('top_n', 5)
        try:
            result = hybrid_recommend_full(user_id, plan_index, top_n)
            return jsonify(result.to_dict(orient="records"))
        except Exception as e:
            return jsonify({'error': str(e)}), 400
    else:
        # Handle form POST from HTML
        user_id = request.form.get('user_id')
        plan_index = request.form.get('plan_index')
        top_n = request.form.get('top_n', 5)
        try:
            top_n = int(top_n)
            result = hybrid_recommend_full(user_id, int(plan_index), top_n)
            results = result.to_dict(orient="records")
            return render_template('index.html', results=results, error=None)
        except Exception as e:
            return render_template('index.html', results=None, error=str(e))

if __name__ == '__main__':
    app.run(debug=True)