/*
  # Initialize ML Model and Features

  1. New Tables
    - Add initial ML model for driver conversion prediction
    - Add feature parameters for the model
    - Add initial cluster data

  2. Data
    - Insert logistic regression model with initial parameters
    - Add scaling and encoding parameters for features
    - Add cluster centroids and characteristics
*/

-- Insert initial model
INSERT INTO ml_models (
  id,
  name, 
  version, 
  model_type, 
  parameters, 
  created_at
)
VALUES (
  gen_random_uuid(),
  'driver_conversion_lr',
  '1.0.0',
  'logistic_regression',
  '{
    "weights": [0.5, -0.3, 0.2, 0.4, -0.1, 0.3, -0.2, 0.1]
  }'::jsonb,
  now()
)
RETURNING id INTO TEMPORARY temp_model_id;

-- Insert feature parameters
INSERT INTO model_features (
  id,
  model_id, 
  feature_name, 
  scaling_params, 
  encoding_params
)
SELECT
  gen_random_uuid(),
  temp_model_id,
  feature_name,
  scaling_params::jsonb,
  encoding_params::jsonb
FROM (
  VALUES
    ('days_to_bgc', '{"mean": 5.0, "std": 2.0}', NULL),
    ('days_to_vehicle', '{"mean": 7.0, "std": 3.0}', NULL),
    ('vehicle_year', '{"mean": 2018.0, "std": 3.5}', NULL),
    ('signup_os', '{"mean": 0, "std": 1}', '{"categories": ["ios", "android"]}'),
    ('signup_channel', '{"mean": 0, "std": 1}', '{"categories": ["organic", "referral", "paid"]}')
) AS f(feature_name, scaling_params, encoding_params);

-- Insert initial clusters
INSERT INTO clusters (
  id,
  model_id, 
  cluster_id, 
  centroid, 
  characteristics
)
SELECT
  gen_random_uuid(),
  temp_model_id,
  cluster_data.cluster_id,
  cluster_data.centroid::jsonb,
  cluster_data.characteristics::jsonb
FROM (
  VALUES
    (
      0,
      '[0.2, -0.1, 0.3, 1, 0, 0, 1, 0]',
      '{
        "size": 1200,
        "conversion_rate": 0.45,
        "avg_days_to_bgc": 4.5,
        "avg_days_to_vehicle": 6.8
      }'
    ),
    (
      1,
      '[-0.1, 0.2, -0.3, 0, 1, 1, 0, 0]',
      '{
        "size": 800,
        "conversion_rate": 0.75,
        "avg_days_to_bgc": 3.2,
        "avg_days_to_vehicle": 5.1
      }'
    ),
    (
      2,
      '[0.4, -0.3, 0.1, 0, 1, 0, 0, 1]',
      '{
        "size": 600,
        "conversion_rate": 0.25,
        "avg_days_to_bgc": 7.8,
        "avg_days_to_vehicle": 9.2
      }'
    ),
    (
      3,
      '[-0.2, 0.1, -0.1, 1, 0, 1, 0, 0]',
      '{
        "size": 1000,
        "conversion_rate": 0.55,
        "avg_days_to_bgc": 5.1,
        "avg_days_to_vehicle": 7.3
      }'
    )
) AS cluster_data(cluster_id, centroid, characteristics);

DROP TABLE IF EXISTS temp_model_id;