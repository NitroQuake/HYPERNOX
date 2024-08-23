import os

import mysql.connector
from flask_session import Session
from flask import Flask, flash, jsonify, redirect, render_template, request, session

import requests
from PIL import Image, ImageOps
from io import BytesIO
import json
import base64
from pprint import pprint
import datetime

# prototype
# Configure application
app = Flask(__name__)

# Ensure templates are auto-reloaded
app.config["TEMPLATES_AUTO_RELOAD"] = True

# Configure CS50 Library to use database
#db = mysql.connector.connect(host = "localhost", user = "root", passwd = "ghs2021!", database = "minecraft")
#mycursor = db.cursor(dictionary=True)

list_of_key_stats = ["wins_bedwars", "losses_bedwars", "winstreak", "beds_broken_bedwars", "beds_lost_bedwars", "games_played_bedwars", "coins",
                     "items_purchased_bedwars", "resources_collected_bedwars", "eight_one_winstreak", "eight_two_winstreak", "four_three_winstreak",
                     "four_four_winstreak", "final_kills_bedwars", "final_deaths_bedwars", "kills_bedwars", "deaths_bedwars"]

list_of_general_gamemodes = ["eight_one", "eight_two", "four_three", "four_four", "core", "two_four", "overall"]
list_of_general_stats = ["wins_bedwars", "losses_bedwars", "beds_broken_bedwars", "beds_lost_bedwars", "final_kills_bedwars", "final_deaths_bedwars", "kills_bedwars", "deaths_bedwars"]
list_of_resources = ["iron_resources_collected_bedwars", "gold_resources_collected_bedwars", "diamond_resources_collected_bedwars", "emerald_resources_collected_bedwars", "resources_collected_bedwars"]
list_of_kd_types = ["entity_attack", "void", "fall", "magic", "entity_explosion", "projectile", "fire_tick", "fire", "suffocation"]
list_of_kd = ["final_kills_bedwars", "final_deaths_bedwars", "kills_bedwars", "deaths_bedwars"]
list_of_purchase_types = ["permanent_items_purchased_bedwars", "items_purchased_bedwars"]

#Figma's inbuilt locofy partly aided in transfering my design to code
@app.after_request
def after_request(response):
    """Ensure responses aren't cached"""
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response

@app.route("/", methods=["GET"])
def index():
    #mycursor.execute("SELECT * FROM players")
    #people = mycursor.fetchall()
    return render_template("index.html") #, people = people)
    
@app.route("/covrstats", methods=["GET"])
def covrstats():
    return render_template("index_compare.html", typeStat = "Overall")

@app.route("/ckdstats", methods=["GET"])
def ckdstats():
    return render_template("index_compare.html", typeStat = "K / D")

@app.route("/ceconstats", methods=["GET"])
def ceconstats():
    return render_template("index_compare.html", typeStat = "Economy")

@app.route("/cprastats", methods=["GET"])
def cprastats():
    return render_template("index_compare.html", typeStat = "Practice")

@app.route("/cchastats", methods=["GET"])
def cchastats():
    return render_template("index_compare.html", typeStat = "Challenge")

@app.route("/ovrstats", methods=["POST"])
def ovrstats():
    # TODO: Add the user's entry into the database
    username = request.form.get("username")

    if not username:
        return redirect("/")

    mycursor.execute("INSERT INTO players (username) VALUES(%s)", (username,))
    db.commit()

    API_KEY = "5cd75e04-638f-4f31-b8af-8af1a0402f36" #8/22

    #Mojang API documentation https://wiki.vg/Mojang_API and https://mojang.readthedocs.io/en/latest/ and https://minecraft.wiki/w/Mojang_API 
    playerUUID_link = f"https://api.mojang.com/users/profiles/minecraft/{username}"
    playerUUID = getInfo(playerUUID_link ).json()["id"] #Gets player UUID from Minecraft API

    player_profile_link = f"https://sessionserver.mojang.com/session/minecraft/profile/{playerUUID}"
    player_profile = getInfo(player_profile_link).json() #Gets player profile from Minecraft API

    # print(player_profile)

    # Extract the Base64 encoded value
    encoded_value = player_profile['properties'][0]['value']

    # Decode the Base64 encoded value
    decoded_bytes = base64.b64decode(encoded_value)
    decoded_str = decoded_bytes.decode('utf-8')

    # Convert the decoded string to a JSON object
    decoded_json = json.loads(decoded_str)

    urlSkin = decoded_json["textures"]["SKIN"]["url"] #returns player skin
    print(urlSkin)

    # Download the image
    response = requests.get(urlSkin)
    response.raise_for_status()  # Ensure we notice bad responses

    # Open the image
    image = Image.open(BytesIO(response.content))

    filePath = f"static/my mc skin.png"
    # Save the image as a PNG file
    image.save(filePath, "PNG")

    stat_dict = getHypixelStats(API_KEY, playerUUID)
    return render_template("stat_page.html", image_url = urlSkin, username = username, stat_dict = stat_dict)


def getInfo(call):
    r = requests.get(call)
    return r

def getHypixelStats(API_KEY, playerUUID):
    stat_dict = {}

    # player_stats = f"https://api.hypixel.net/v2/player?key={API_KEY}&name={username}"
    player_stats = f"https://api.hypixel.net/v2/player?key={API_KEY}&uuid={playerUUID}"

    #player_recent_games = f"https://api.hypixel.net/v2/recentgames?key={API_KEY}&uuid={playerUUID}"

    #leaderboards = f"https://api.hypixel.net/v2/leaderboards?key={API_KEY}"
    #getInfo(leaderboards).json()["leaderboards"]["BEDWARS"]

    response = getInfo(player_stats)

    for key in list_of_key_stats:
        try:
            stat_dict[key] = [response.json()["player"]["stats"]["Bedwars"][key]]
        except:
            stat_dict[key] = ["N / A"]

    for stat in list_of_general_stats:
        sumStat = 0
        stat_dict[stat + "_normal"] = []
        for gamemode in list_of_general_gamemodes:
            if gamemode == "core" or gamemode == "overall":
                if sumStat != 0:               
                    stat_dict[stat + "_normal"].append(sumStat)
                else:
                    stat_dict[stat + "_normal"].append("N / A")
                continue

            try:
                value = response.json()["player"]["stats"]["Bedwars"][f"{gamemode}_{stat}"]
                stat_dict[stat + "_normal"].append(value)
                sumStat += int(value)
            except:
                stat_dict[stat + "_normal"].append("N / A")

    stat_dict["games_played_bedwars_normal"] = [int(stat_dict["wins_bedwars_normal"][len(stat_dict["wins_bedwars_normal"]) - 1]) + int(stat_dict["losses_bedwars_normal"][len(stat_dict["losses_bedwars_normal"]) - 1])]
    
    sumStat = 0
    sumLosses = 0
    stat_dict["carried_normal"] = []
    stat_dict["carried_percent_normal"] = []
    for gamemode in list_of_general_gamemodes:
        if gamemode == "core" or gamemode == "eight_one":
            continue

        if gamemode == "overall":
            if sumStat != 0:               
                stat_dict["carried_normal"].append(sumStat)
                stat_dict["carried_percent_normal"].append(format_2d_float(sumStat / sumLosses))
            else:
                stat_dict["carried_normal"].append("N / A")
                stat_dict["carried_percent_normal"].append("N / A")
            continue

        try:
            losses = int(response.json()["player"]["stats"]["Bedwars"][f"{gamemode}_losses_bedwars"])
            value = int(response.json()["player"]["stats"]["Bedwars"][f"{gamemode}_final_deaths_bedwars"]) - losses
            stat_dict["carried_normal"].append(value)
            stat_dict["carried_percent_normal"].append(format_2d_float(value / losses))
            sumStat += value
            sumLosses += losses
        except:
            stat_dict["carried_normal"].append("N / A")
            stat_dict["carried_percent_normal"].append("N / A")
    
    total_resources = 0
    stat_dict["resources_collected_bedwars_normal"] = []
    stat_dict["resources_collected_bedwars_per_collect_normal"] = []
    for resource in list_of_resources:
        sumStat = 0
        for gamemode in list_of_general_gamemodes:
            if gamemode == "core" or gamemode == "overall":
                continue

            try:
                value = response.json()["player"]["stats"]["Bedwars"][f"{gamemode}_{resource}"]
                sumStat += int(value)
            except:
                pass
        
        if resource == "resources_collected_bedwars" and total_resources != 0:
            stat_dict["resources_collected_bedwars_normal"].append(total_resources)
            stat_dict["resources_collected_bedwars_per_collect_normal"].append(format_2d_float(total_resources / int(stat_dict["games_played_bedwars_normal"][0])))
            break
        elif resource == "resources_collected_bedwars":
            stat_dict["resources_collected_bedwars_normal"].append("N / A")
            stat_dict["resources_collected_bedwars_per_collect_normal"].append("N / A")
            break
        
        if sumStat != 0:
            stat_dict["resources_collected_bedwars_normal"].append(sumStat)
            total_resources += sumStat
        else:
            stat_dict["resources_collected_bedwars_normal"].append("N / A")

        try:
            stat_dict["resources_collected_bedwars_per_collect_normal"].append(format_2d_float(sumStat / int(stat_dict["games_played_bedwars_normal"][0])))
        except:
            stat_dict["resources_collected_bedwars_per_collect_normal"].append("N / A")
    
    stat_dict["permanent_items_purchased_bedwars_normal"] = []
    stat_dict["items_purchased_bedwars_normal"] = []
    for purchase_type in list_of_purchase_types:
        sumStat = 0
        for gamemode in list_of_general_gamemodes:
            if gamemode == "core" or gamemode == "overall":
                continue

            try:
                value = response.json()["player"]["stats"]["Bedwars"][f"{gamemode}_{purchase_type}"]
                sumStat += int(value)
            except:
                pass

        if sumStat != 0:
            stat_dict[f"{purchase_type}_normal"].append(sumStat)
        else:
            stat_dict[f"{purchase_type}_normal"].append("N / A")
        
    
    for kd in list_of_kd:
        stat_dict[kd + "_type_normal"] = []
        for type in list_of_kd_types:
            if type == "suffocation" and (kd == "final_kills_bedwars" or kd == "kills_bedwars"):
                stat_dict[kd + "_type_normal"].append("N / A")
                continue

            try:
                value = response.json()["player"]["stats"]["Bedwars"][f"{type}_{kd}"]
                stat_dict[kd + "_type_normal"].append(value)
                print(f"{type}_{kd}: {value}")
            except:
                stat_dict[kd + "_type_normal"].append("N / A")


    #file_path_stat = f"static/player_stats.json"
    #with open(file_path_stat, 'w') as f:
        #json.dump(response.json()["player"]["stats"]["Bedwars"], f)
    
    #bedwars_level = response.json()["player"]["achievements"]["bedwars_level"] #returns player bedwars level
    #first_login = datetime.datetime.fromtimestamp(response.json()["player"]["firstLogin"] // 1000.0) #returns player first login
    #last_login = datetime.datetime.fromtimestamp(response.json()["player"]["lastLogin"] // 1000.0) #returns player last login
    #bedwars_winstreak = response.json()["player"]["stats"]["Bedwars"]["winstreak"] #returns player bedwars winstreak

    rate_limit_remaining = response.headers.get('RateLimit-Remaining')
    print(f"RateLimit-Remaining: {rate_limit_remaining}") #returns rate limit remaining

    return stat_dict

@app.template_filter('format_number')
def format_number(value):
    if isinstance(value, (int, float)):
        return f"{value:,}"
    return value

@app.template_filter('format_float')
def format_float(value):
    if isinstance(value, (int, float)):
        return f"{value:,.3f}"
    return value

def format_2d_float(value):
    if isinstance(value, (int, float)):
        return f"{value:,.2f}"
    return value

@app.template_filter('format_ratio')
def format_ratio(value_one, value_two):
    if value_one == "N / A" or value_two == "N / A":
        return value_one
    value_two = int(value_two)
    if value_two == 0:
        return value_one
    return format_float(int(value_one) / int(value_two))

