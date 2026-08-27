import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.ensemble import HistGradientBoostingClassifier
from sklearn.utils.class_weight import compute_sample_weight


# Load dataset
df = pd.read_csv( r"C:\Users\pedga\Desktop\TCS HACK\ml-service\ai4i2020_extended_manufacturing.csv.csv")


# Features
features = [
    "Type",
    "Air temperature [K]",
    "Process temperature [K]",
    "Rotational speed [rpm]",
    "Torque [Nm]",
    "Tool wear [min]"
]

target = "Machine failure"


X = df[features].copy()
y = df[target].copy()


# Convert Type to numerical columns
X = pd.get_dummies(
    X,
    columns=["Type"],
    drop_first=True
)


# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)


# Handle class imbalance
sample_weights = compute_sample_weight(
    class_weight="balanced",
    y=y_train
)


# Train model
gb_model = HistGradientBoostingClassifier(
    max_iter=200,
    random_state=42
)

gb_model.fit(
    X_train,
    y_train,
    sample_weight=sample_weights
)


# Save model
joblib.dump(
    gb_model,
    "gradient_boosting_model.pkl"
)


# Save feature names
joblib.dump(
    list(X.columns),
    "model_features.pkl"
)


print("Model trained and saved successfully!")
print("Features:", list(X.columns))