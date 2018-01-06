# S-BPM Modelling Platform #

This is a modelling platform for S-BPM processes. S-BPM processes can be exported and imported as OWL 2 files. The modelling platform consists out of two parts: Frontend and Backend. The frontend is build with VueJS and JointJS. The backend is build with FeathersJS and MongoDB.

> This S-BPM modelling platform is based on the S-BPM modelling platform available [here](https://github.com/stefanstaniAIM/IPPR2016).

## Tutorial Videos ##
[ModellingPlatform](https://youtu.be/3gJXmBRKWNo) (German)

## Functionalities ##

The following table shows which S-BPM elements had been implemented and can be modeled in the S-BPM modelling platform.

| S-BPM elements | Implemented | Comment |
| ------------ | ------------ | ------- |
| Process | Yes | - |
| Multiprocess | No | - |
| Subject interaction | Yes | - |
| Subject behavior | Yes | - |
| Subject | Yes | - |
| Message | Yes | - |
| State | Yes | - |
| State transition | Yes | - |
| State placeholder | No | - |
| Macro state | No | - |
| Macro transition | No | - |
| Timeout transition | No | - |
| Manual transition | No | - |
| Interface subject | Yes | - |
| Subject extension | No | - |
| Abstract subject | No | - |
| Behavior macro | No | - |
| Behavior macro class | No | - |
| Exception handling | No | - |
| Behavior extension | No | - |
| Alternative clause | No | - |
| Visual representation | Yes | - |

## Usage ##
### Prerequisites ###

 - NodeJS
 - MongoDB
 
### Setup ###

**Client:**

 - Go to ```client``` and run ```npm install```

**Server:**

 - Go to ```server``` and run ```npm install```
 
### Startup ###

**Client:**

 1. Go to ```client``` and run ```npm start```
 
**Server:**

 1. Start mongoDB server
 2. Go to ```server``` and run ```npm start```

## License

Copyright (c) 2016

Licensed under the [MIT license](LICENSE).
