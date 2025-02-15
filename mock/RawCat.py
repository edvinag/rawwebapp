
import sys
import requests
import numpy as np
import io
import socket
import threading
import sys
import time
import json
from numpy import (array, dot, arccos, clip)
from numpy.linalg import norm
import pymap3d
import time
from Regulator import Regulator

class RawCat:
    def __init__(self):
        self.x=[0, 0, 10 ,0*2*np.pi/360]
        self.xdot=[0,0,0,0]
        self.yaw = 0*np.pi/360
        self.lr = 10
        self.lf = 10
        self.T = 0.2
        self.acc = 0
        self.disp = [0, 0]

        data = None
        with open('data.json', 'r') as j:
            data = json.load(j)

        self.enu_ref_lat = data['gps']['location']['latitude']
        self.enu_ref_lon = data['gps']['location']['longitude']

        self.regulator = Regulator()

        updateThread = threading.Thread(target = self.update, daemon=True)
        updateThread.start()

        updateGpsThread = threading.Thread(target = self.updateGps, daemon=True)
        updateGpsThread.start()

        print("Init RawCat")

    def updateRoute(self):
        self.regulator.updateRoute()

    def beta(self, yaw):
        return np.arctan(np.tan(self.yaw)*self.lr/(self.lr + self.lf))

    def get_geodetic(self):
        return pymap3d.enu2geodetic(self.x[0], self.x[1], 0, self.enu_ref_lat, self.enu_ref_lon, 0)

    def update(self):
        while(True):
            location = self.get_geodetic()
            settings = None
            with open('settings.json', 'r') as j:
                settings = json.load(j)
            if(not settings['rudder']['darkMode']):
                if settings['controller']['type'] != "rudder":
                    self.yaw = self.regulator.update(location[0], location[1], self.x[3])
                else:
                    self.yaw = ((settings['rudder']['ref']-512)/1024)*np.pi/4

            self.xdot[0] = self.x[2]*np.cos(self.x[3] + self.beta(self.yaw)) - self.disp[0]
            self.xdot[1] = self.x[2]*np.sin(self.x[3] + self.beta(self.yaw)) - self.disp[1]
            self.xdot[2] = self.acc
            self.xdot[3] = -(self.x[2]/self.lr) * np.sin(self.beta(self.yaw))

            for i in range(0,4):
                self.x[i] = self.x[i] + self.xdot[i]*self.T

            time.sleep(self.T)

    def updateGps(self):
        while(True):
            location = self.get_geodetic()
            with open('data.json', 'r') as j:
                data = json.load(j)

            data['gps']['location']["latitude"] = location[0]
            data['gps']['location']["longitude"] = location[1]
            azRaw = np.degrees((-self.x[3]+np.pi/2) % (2 * np.pi))
            data['gps']['course'] = azRaw
            
            with open('data.json', 'w') as outfile:
                json.dump(data, outfile)
            time.sleep(0.5)
            