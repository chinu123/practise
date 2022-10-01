function ratelimiter(rpsCount=5, duration=60000) {
    const userRequestMap=new Map();
    return function (userID, api) {
        const userData=userRequestMap.get(userID);
        const now=Math.floor(new Date().getTime()/10000);
        if(userData) {
            updateEntryCount(userData, now, rpsCount, duration);
        }else {
            userRequestMap.set(userID, (new Map).set(now, 1));
        }
        console.log(userRequestMap);
    }
}


function updateEntryCount(userData, now, rpsCount, duration) {
    const existingData = userData.get(now);
    if(existingData) {
        const existingTimeWindows = Object.keys(userData);
        const totalCount = existingTimeWindows.reduce((sum,time) => {if(time - now < duration) {return sum+userData.get(time)}}, 0)
        if(existingData >= rpsCount || totalCount >= rpsCount) {
            throw new Error("too many calls")
        } else {
            if(now - existingTimeWindows[0] > duration/1000) {
                userData.delete(existingTimeWindows[0]);
            }
            userData.set(now, existingData+1);
        }
    } else {
        userData.set(now, 1);
    }
}

const a= ratelimiter(3);
a(2);
a(2);
a(2);
a(2);
setTimeout(() => a(2), 60000)
