from flask import Flask, json, request, jsonify
from flask_cors import CORS
from RawCat import RawCat

gps = {"gps": {"location": {"longitude": 11.924482585745864, "latitude": 57.5726428059939}, "course": 45}}
routeInfo = {"longitude": 11.924482585745864, "latitude": 57.5726428059939, "course": 45, "refcourse": 45, "goallongitude": 11.467781080864368, "goallatitude": 58.19432362991195,}
api = Flask(__name__)
CORS(api)

rawcat = RawCat()

@api.route('/route', methods=['GET'])
def get_route():
  json_data = None
  with open('route.json', 'r') as j:
    json_data = json.load(j)

  settings = None
  with open('settings.json', 'r') as j:
    settings = json.load(j)
  if(request.args.get('goalIndex') != None):
    print("goal:" + request.args.get('goalIndex'))
    settings['route']['goalIndex'] = int(request.args.get('goalIndex'))
    
  with open('settings.json', 'w') as outfile:
    json.dump(settings, outfile)

  rawcat.updateRoute()

  return jsonify(json_data)


@api.route('/route', methods=['POST'])
def post_route():
  settings = None
  with open('settings.json', 'r') as j:
    settings = json.load(j)

  if(request.args.get('keepIndex') != None and request.args.get('keepIndex') != "true"):
    settings['route']['goalIndex'] = 0
  
  with open('settings.json', 'w') as outfile:
    json.dump(settings, outfile)

  requestjson = json.loads(request.data)

  with open('route.json', 'w') as outfile:
    json.dump(requestjson, outfile)

  rawcat.updateRoute()
  return jsonify(requestjson)


@api.route('/gps', methods=['GET'])
def get_gps():
  return json.dumps(gps)


@api.route('/routeInfo', methods=['GET'])
def get_routeInfo():
  return json.dumps(routeInfo)


@api.route('/all', methods=['GET'])
def get_all():
  data = None
  with open('data.json', 'r') as j:
    data = json.load(j)

  settings = None
  with open('settings.json', 'r') as j:
    settings = json.load(j)
  
  allData = {"data": data, "settings": settings}

  return json.dumps(allData)


@api.route('/data', methods=['GET'])
def get_data():
  json_data = None
  with open('data.json', 'r') as j:
    json_data = json.load(j)
  return jsonify(json_data)

def boolConverter(b):
  if(b == "true" or b == "True"):
    return True
  return False

@api.route('/rudder', methods=['GET'])
def get_rudder():
  darkMode = request.args.get('darkMode')
  ref = request.args.get('ref')
  
  settings = None
  with open('settings.json', 'r') as j:
    settings = json.load(j)

  if(darkMode != None):
    settings['rudder']['darkMode'] = boolConverter(darkMode)

  if(ref != None):
    settings['rudder']['ref'] = int(ref)

  with open('settings.json', 'w') as outfile:
    json.dump(settings, outfile)
  
  return jsonify(settings['rudder'])

@api.route('/controller', methods=['GET'])
def get_controller():
  type_v = request.args.get('type')
  r = request.args.get('r')
  settings = None
  with open('settings.json', 'r') as j:
    settings = json.load(j)

  if(type_v != None):
    settings['controller']['type'] = type_v
  if(r != None):
    settings['controller']['refCourse'] = r
  if(request.args.get('reflatitude') != None):
    settings['controller']['reflocation']['latitude'] = request.args.get('reflatitude')
  if(request.args.get('reflongitude') != None):
    settings['controller']['reflocation']['longitude'] = request.args.get('reflongitude')

  with open('settings.json', 'w') as outfile:
    json.dump(settings, outfile)
  
  return jsonify(settings['controller'])


@api.route('/settings', methods=['GET'])
def get_settings():
  json_data = None
  with open('settings.json', 'r') as j:
    json_data = json.load(j)

  return jsonify(json_data)


@api.route('/settings', methods=['POST'])
def post_settings():
    requestjson = json.loads(request.data)
    with open('settings.json', 'w') as outfile:
      json.dump(requestjson, outfile)
    return jsonify(requestjson)

@api.route('/phone', methods=['POST'])
def post_phone():
    settings = None
    with open('settings.json', 'r') as j:
      settings = json.load(j)
    settings['controller']['refCourse'] =request.json["locationMagneticHeading"]
    with open('settings.json', 'w') as outfile:
      json.dump(settings, outfile)
    requestjson = json.loads(request.data)
    with open('phone.json', 'w') as outfile:
      json.dump(requestjson, outfile)
    return jsonify(requestjson)

if __name__ == '__main__':
  # api.run()
    api.run(host="0.0.0.0")


