const UserConst = require('../consts/UserConsts');
const {User} = require('../models/User');


class CalculationHelper{
    static async ReturnTotalExpAndLevel(user, letters)
    {
        if(!(user instanceof User))
            throw new TypeError(`Method returnTotalExpAndLevel parameter is not a type of User! It is type of: ${typeof user}`);
    
            let totalExp = user.experience + letters;
    
        while(totalExp > 0)
        {
            const requiredExp = UserConst.Level[user.level+1];
    
            if(totalExp >= requiredExp)
            {
                user.level = user.level + 1;
                totalExp = totalExp - requiredExp;
            }
            else
            {
                totalExp = 0;
            }
        }
    
        user.experience = user.experience + letters;
    
        return user;
    }
}



module.exports = CalculationHelper;