# jPlayer
Get numbers and names of j-league players from J.LEAGUE (https://www.jleague.co)

players.json
```JSON
{
  "version": "2020-02-23",
  "teams": {
    "sapporo": {
      "nationality": "JPN",
      "category": "J1",
      "players": {
        "1": "SUGENO",
        "21": "AWAKA",
        "29": "KAWIN",
        "40": "SATO",
        "48": "JAY"
      }
    },
    "cosaka_u23": {
      "nationality": "JPN",
      "category": "J3",
      "players": {
        "1": "NAGAISHI",
        "21": "KIM",
        "27": "AHN",
        "33": "TAWAN",
        "42": "FUJIO",
        "48": "SHIMBO"
      }
    }
  }
}    
```

## Requirements
* Google Chrome
* chromedriver-binary
* selenium

## Installation
1. Install Google Chrome
2. Check the version number of Google Chrome
```Shell
$ google-chrome --version
Google Chrome 84.0.4147.125

# or click the three vertical dots in the upper-right corner of the window,
# then click Help > About Google Chrome
```

3. Install chromedriver-binary (specify the same version as Google Chrome) 
```Shell
$ pip install chromedriver-binay~=84.0
```
4. Install selenium
```
$ pip install selenium
```

## Usage
```Shell
$ python jplayer.py players.json
```
