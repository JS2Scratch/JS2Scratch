module.exports = {
    enum: {
        motion: {
            MoveSteps: "motion_movesteps",
            TurnRight: "motion_turnright",
            TurnLeft: "motion_turnleft",
            GotoSprite: "motion_goto",
            GotoCoords: "motion_gotoxy",
            TweenToCoords: "motion_glideto",
            TweenTimeToCoords: "motion_glidesecstoxy",
            PointInDirection: "motion_pointindirection",
            PointTowards: "motion_pointtowards",
            ChangeX: "motion_changexby",
            ChangeY: "motion_changeyby",
            SetX: "motion_setx",
            SetY: "motion_sety",
            Bounce0nEdge: "motion_ifonedgebounce",
            RotationStyle: "motion_setrotationstyle",
            Xpos: "motion_xposition",
            Ypos: "motion_yposition",
            Direction: "motion_direction",
            
        },

        looks: {
            SayForSeconds: "looks_sayforsecs",
            Say: "looks_say"
        },

        events: {
            GreenFlag: "event_whenflagclicked"
        },

        variable: {
            SetVariable: "data_setvariableto"
        }
    },

    blockOpCode: ((section, name) => {
        return `${section}_${name}`
    }),

    createBlock: ((Code = "event_whenflagclicked", next = null, parent = null, inputs = {}, fields = {}, shadow = false, topLevel = false, x = 0, y = 0) => {
        return {
            "opcode": Code,
            "next": next,
            "parent": parent,
            "inputs": inputs,
            "fields": fields,
            "shadow": shadow,
            "topLevel": topLevel,
            "x": x,
            "y": y
        }
    })
}