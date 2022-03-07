#!/usr/bin/env python3

import time
import re
import json
import datetime
import sys
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import TimeoutException
import chromedriver_binary


def get_teams():
    teams = {}
    driver.get("https://www.jleague.co/clubs/")
    try:
        leagues = driver.find_elements_by_class_name('clubs-container')
        j = 1
        for league in leagues:
            teams[j] = []
            clubs = league.find_elements_by_tag_name('a')
            for club in clubs:
                team_name = club.get_attribute('href').split('/')[-2]
                team_avatar = club.find_element_by_class_name('team-avatar')
                short_name = team_avatar.get_attribute('alt').split(' ')[0]
                teams[j].append((team_name, short_name))
            j += 1
        return teams
    except Exception as e:
        print(e)
        return {}


def get_players(team):
    players = {}
    driver.get("https://www.jleague.co/clubs/%s/" % team)
    try:
        WebDriverWait(driver, 15).until(EC.presence_of_all_elements_located((By.CLASS_NAME, 'player-item')))
    except TimeoutException as te:
        print(te)
        return{}
    try:
        profile = driver.find_element_by_id('players')
        player_list = profile.find_elements_by_class_name('player-item')
        for player in player_list:
            number = player.find_element_by_class_name('uniform-no').text
            name = player.find_element_by_class_name('name').text
            if number:
                for item in name.split(' '):
                    if len(item) == len(re.findall('[A-Z]', item)):
                        players[number] = item
                        break
        return players
    except Exception as e:
        print(e)
        return {}


if __name__ == "__main__":
    """
    all_players = {
        "version": "2020-02-23",
        "teams": {
            "sendai": {
                "nationality": "Japan",
                "category": "J1",
                "players": {
                }
            }
        }
    }
    """
    all_players = {
        "version": datetime.datetime.now().strftime("%Y-%m-%d"),
        "teams": {}
    }

    fh = sys.stdout
    if (len(sys.argv) == 2):
        filename = sys.argv[1]
        if (filename != '-'):
            fh = open(sys.argv[1], 'w')
        elif (len(sys.argv) > 2):
            print("Usage: jplayer.py [filename]")
            exit()

    options = Options()
    options.add_argument('--headless')
    driver = webdriver.Chrome(options=options)

    teams = get_teams()
    for i in teams:
        print("J%s" % i, file=sys.stderr)
        for (team, short_name) in teams[i]:
            print(team, file=sys.stderr)
            all_players["teams"][short_name] = {
                "nationality": "JPN",
                "category": "J%d" % i,
            }
            players = get_players(team)
            all_players["teams"][short_name]["players"] = players

    driver.quit()

    all_players_json = json.dumps(all_players, indent=2)
    fh.write(all_players_json)

    if (fh != sys.stdout):
        fh.close()
