# Automation Scripts for MLB Draft Data

This folder contains automation scripts for fetching, processing, and analyzing MLB draft data from 1990 to 2015. The scripts are designed to be modular, allowing for easy maintenance and scalability.

---

## **Folder Structure**

The `automation/` folder is organized as follows:

```
automation/
├── data/                       # Data storage
│   ├── raw/                    # Raw data fetched from the API
│   ├── processed/              # Processed and cleaned data
│   ├── output/                 # Final results (e.g., CSV files, reports)
├── logs/                       # Logs for script execution
├── scripts/                    # Python scripts for automation
│   ├── fetch_mlb_draft_data.py # Script to fetch data from the API
├── requirements.txt            # Python dependencies for automation
└── .gitignore                  # Ignore unnecessary files
```

---

Navigate to the `automation` folder:

```bash
cd mlb-hackathon/automation
```

---

### **Step 2: Set Up a Virtual Environment (Optional, Recommended)**

Create a virtual environment to isolate dependencies:

```bash
python -m venv venv
```

Activate the virtual environment:

- **On macOS/Linux**:
  ```bash
  source venv/bin/activate
  ```
- **On Windows**:
  ```bash
  venv\Scripts\activate
  ```

---

### **Step 3: Install Dependencies**

Install all required Python packages listed in `requirements.txt`:

```bash
pip install -r requirements.txt
```

---

### **Step 4: Run the Scripts**

The scripts in this folder are modular. Use them as needed:

1. **Fetch Data**:
   Fetch MLB draft data from the API:

   ```bash
   python scripts/fetch_data.py
   ```

   This will save raw data to the `data/raw/` folder.

2. **Process Data**:
   Clean and transform the raw data:

   ```bash
   python scripts/process_data.py
   ```

   Processed data will be saved to the `data/processed/` folder.

3. **Analyze Data**:
   Perform analysis and generate insights:
   ```bash
   python scripts/analyze_data.py
   ```
   Results will be saved to the `data/output/` folder.

---

## **Dependencies**

The following Python packages are required:

- `requests`: For fetching data from APIs.
- `pandas`: For data manipulation and processing.
- `matplotlib`: For visualizations (if needed).
- `python-dotenv`: For managing environment variables.

All dependencies are listed in `requirements.txt`. Install them with:

```bash
pip install -r requirements.txt
```

---

## **Environment Variables**

Some scripts may require environment variables, such as an API key. Add these variables to a `.env` file in the `automation/` folder:

```plaintext
API_KEY=your_api_key
BASE_URL=https://example.com/api
```

The `.env` file is ignored by Git (`.gitignore`) for security.

---

## **Logs**

Logs for script execution are saved in the `logs/` folder. Check `script_logs.log` for details on any errors or process summaries.

---

## **Contributing**

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-branch-name
   ```
3. Make your changes and submit a pull request.

---

## **Process for fetching data**

1. Run `fetch_mlb_draft_data.py` to fetch the data from the API.
2. Run `fetch_stats_leagues.py` to fetch the data from the API. and save it to MongoDB.
3. Run `match_players_slugs.py` to match the players to the slugs. from Baseball Reference.
4. Run `fetch_baseball_reference_minor_stats.py` to fetch the data from the API.
5. Run `calculate_scouting_grades.py` to calculate the scouting grades.

## **Contact**

For questions or support, contact:

- **Email**: your.email@example.com
- **GitHub**: [your-github-profile](https://github.com/your-profile)

---

## **License**

This project is licensed under the [MIT License](LICENSE).
