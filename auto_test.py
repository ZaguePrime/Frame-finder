from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

# Start the session
driver = webdriver.Chrome()

# Navigate to frame finder
driver.get("http://127.0.0.1:5500/Home.html")

# Set up a WebDriverWait with a timeout of 10 seconds
wait = WebDriverWait(driver, 10)

# Wait for the search bar to be visible
search_bar = wait.until(EC.visibility_of_element_located((By.ID, "itemName")))

# Wait for the search button to be clickable
search_button = wait.until(EC.element_to_be_clickable((By.ID, "searchButton")))

# Test the search function
search_bar.send_keys("scattering inferno")
time.sleep(3)
search_button.click()

#wait 20 seconds to check stuff
time.sleep(20)

# Close the WebDriver session
driver.quit()
