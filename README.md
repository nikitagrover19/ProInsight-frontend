# 🧠 ProInsight — Email Insight Classifier

**ProInsight** is a Machine Learning and NLP-based system designed to extract insights, classify content, and visualize communication patterns from large-scale corporate email data.  
It leverages the **Enron Email Dataset** and integrates with the **Gemini API** for semantic analysis.

---

## 🌐 Live Links

- **Frontend (Visualization Layer):** [https://proinsight-ml.vercel.app](https://pro-insight-frontend-18ku.vercel.app/)  
- **Backend API:** [https://proinsight-backend.onrender.com](https://proinsight-backend.onrender.com)  
- **Backend Repository:** [ProInsight-backend (GitHub)](https://github.com/nikitagrover19/ProInsight-ML)

---

## 📂 Dataset

**Source:** [Enron Email Dataset (Kaggle)](https://www.kaggle.com/datasets/wcukierski/enron-email-dataset)

### 🧹 Data Cleaning
The raw dataset was parsed using Python’s `email` module to extract:
- `Message-ID`
- `Date`
- `From`
- `To`
- `Subject`
- `Body`

The cleaned data was stored as **`emails_clean.csv`** for further NLP-based feature extraction.

---

## ⚙️ Preprocessing & Feature Engineering

- **Text Cleaning:** Removal of stopwords, punctuation, and non-ASCII characters  
- **Tokenization & Lemmatization:** Using **SpaCy**  
- **Feature Extraction:** TF-IDF and frequency-based analysis  
- **Network Analysis:** Communication graphs built using **NetworkX**

---

## 🧩 Machine Learning Pipeline

1. **Email Parsing & Cleaning**  
2. **Exploratory Data Analysis (EDA)**  
3. **Feature Extraction:** TF-IDF and embeddings  
4. **Content Classification & Clustering**  
5. **Visualization Layer:** Interactive insight presentation

---

## 🧰 Tech Stack

**Languages:**  
- Python  

**Libraries & Tools:**  
- Pandas  
- NumPy  
- SpaCy  
- TextBlob  
- scikit-learn  
- NetworkX  
- Matplotlib  

**API Integration:**  
- Gemini API  

**Backend Framework:**  
- FastAPI  

**Frontend Framework:**  
- React.js  

**Deployment:**  
- **Backend:** Render  
- **Frontend:** Vercel  

---

## 📊 Output

- ✅ Cleaned dataset: **`emails_clean.csv`**  
- 📈 Communication network visualizations  
- 🔍 Keyword and classification-based insights  

---

## 💡 Future Scope
- Integration of sentiment and tone detection  
- Dashboard enhancements with time-based communication trends  
- Expansion to multi-corporate datasets  


