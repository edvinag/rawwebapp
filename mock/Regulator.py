import sys
import time
import pymap3d
import numpy as np
from simple_pid import PID
from pymap3d.vincenty import vdist
import threading
import json


class Regulator:
    def __init__(self):
        self.coordinates = None
        self.err = 0
        self.u = 0

        settings = None
        with open('settings.json', 'r') as j:
            settings = json.load(j)

        self.goalIndex = 0
        self.lat_goal = None
        self.lon_goal = None
        
        self.updateRoute()

        self.pidRaw = PID(0.05, 0, 0, setpoint=0, output_limits=(-0.9, 0.9))

    def updateRoute(self):
        with open("route.json") as json_file:
            path = json.load(json_file)
            self.coordinates = path["geometry"]["coordinates"]
        
        with open('settings.json', 'r') as j:
            settings = json.load(j)
            self.goalIndex = int(settings['route']['goalIndex'])
            print("self.goalIndex: " + str(self.goalIndex))

        self.lat_goal = self.coordinates[self.goalIndex][1]
        self.lon_goal = self.coordinates[self.goalIndex][0]
        self.updateGoal()
        

    def unit_vector(self, vector):
        return vector / np.linalg.norm(vector)

    def angle_between(self, v1, v2):
        v1_u = self.unit_vector(v1)
        v2_u = self.unit_vector(v2)
        return np.arccos(np.clip(np.dot(v1_u, v2_u), -1.0, 1.0))

    def get_v(self, deg):
        r = np.radians(deg)
        v = [np.cos(r), np.sin(r)]
        t = np.arctan2(v[1], v[0])
        if t < 0:
            t = 2*np.pi + t
        return v, r, t , np.degrees(t)

    def get_error(self, deg1, deg2):
        v1, _, _, td1 = self.get_v(deg1)
        v2, _, _, td2 = self.get_v(deg2)
        b = np.degrees(self.angle_between(v1, v2))

        if td1 > td2 and np.abs(td1 - td2) < 180:
            b = -b
        elif td1 < td2 and np.abs(td1 - td2) > 180:
            b = -b

        return np.abs(b), b

    def get_u_mod(self):
        return int(self.u*512) + 512

    def update(self, gps_lat, gps_lon, gps_yaw):
        dist_m, az = vdist(gps_lat, gps_lon, self.lat_goal, self.lon_goal)
        with open('settings.json', 'r') as j:
                settings = json.load(j)
        if(settings['controller']['type'] == "course"):
            az = float(settings['controller']['refCourse'])

        azRaw = np.degrees((-gps_yaw+np.pi/2) % (2 * np.pi))
        if(settings['controller']['type'] == "route"):
            if dist_m < 5 and self.goalIndex < len(self.coordinates)-1:
                self.goalIndex = self.goalIndex + 1
                self.lat_goal = self.coordinates[self.goalIndex][1]
                self.lon_goal = self.coordinates[self.goalIndex][0]
                self.updateGoal()
            elif self.goalIndex == (len(self.coordinates) - 1):
                self.goalIndex = 0

        if(settings['controller']['type'] == "location"):
            self.lat_goal = float(settings['controller']['reflocation']['latitude'])
            self.lon_goal = float(settings['controller']['reflocation']['longitude'])
            
        _, self.err = self.get_error(az, azRaw)
        self.u = self.pidRaw(self.err)

        return self.u

    def updateGoal(self):
        settings = None
        with open('settings.json', 'r') as j:
            settings = json.load(j)

        settings['controller']["reflocation"]["latitude"] = self.lat_goal
        settings['controller']["reflocation"]["longitude"] = self.lon_goal
        settings['route']["goalIndex"] = self.goalIndex

        with open('settings.json', 'w') as outfile:
            json.dump(settings, outfile)
        