/**
 * Created by Administrator on 2017/3/13.
 */
require("../base/CBaseRoom");
require("../../../base/Core");
require("./CZJHPerson");

Core.$Defines("Game.Const.CDataZJHRoom", global)({
    ChangeType:
    {
        "AddP":1,
        "DelP":2,
        "Ready":3,
        "Activity":4
    }
});
Class({
    ClassName:"Game.Data.CDataZJHRoom",
    Base:"Game.Data.CBaseRoom",
    PersonClass:Game.Data.CZJHPerson,
    HallPoint:0,
    Ready:{
        get:function()
        {

            var r = false;
            if(this.m_pCurrentCount>1)
            {
                r = true;
                var map = this.Persons;
                for(var uid in map)
                {
                    if(uid !=this.Roomer  && !map[uid].Ready)
                    {
                        r = false;
                        break;
                    }
                }
            }
            return  r;

        }

    },
    ctor:function()
    {
        Client.addmap("onRoomNewPerson",this);
        Client.addmap("onRoomLeavePerson",this);
        Client.addmap("onUserReady",this);
        Client.addmap("zjhJoinRes",this);
        Client.addmap("onZJHActivity",this);
        Game.Data.CBaseRoom.prototype.ctor.apply(this,arguments);
    },
    destruct:function()
    {
        Client.removemap("onRoomNewPerson",this);
        Client.removemap("onRoomLeavePerson",this);
        Client.removemap("onUserReady",this);
        Client.removemap("zjhJoinRes",this);
        Client.removemap("onZJHActivity",this);

    },
    onRoomLeavePerson:function(msg)
    {

        this.OldValue = [msg.seat,Game.Const.CDataZJHRoom.ChangeType.DelP];
        this.removePerson(msg.seat,msg.roomer);
    },
    onRoomNewPerson:function(msg)
    {
        this.OldValue = [msg.seat,Game.Const.CDataZJHRoom.ChangeType.AddP];
        this.addPerson(msg);
    },
    onUserReady:function(msg)
    {
        var seat = msg.seat,ready=msg.r;
        this.OldValue = [seat,Game.Const.CDataZJHRoom.ChangeType.Ready];
        this.Value[seat].onUserReady(ready);
        this.Notify();
    },
    zjhJoinRes:function(msg) {
        var room = msg.r;
        this.RoomID = room.id;
        this.Roomer = room.roomer;
        this.OldValue = null;
        for(var i=0;i<room.p.length;i++)
        {
            this.addPerson(room.p[i])
        }
    },
    onZJHActivity:function(msg)
    {
        this.HallPoint = msg.hp;
        this.CurrentActivity = msg.au;
        this.OldValue = [this.CurrentActivity,Game.Const.CDataZJHRoom.ChangeType.Activity];
        this.Notify();
    }
})