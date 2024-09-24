// typings/@utils/library.d.ts
// This doesn't even get ran. Everything here is non-functional.

import { CallExpression } from '@babel/types';

export enum BlockOpCode {
    MotionMoveSteps = "motion_movesteps",
    MotionTurnRight = "motion_turnright",
    MotionTurnLeft = "motion_turnleft",
    MotionGoTo = "motion_goto",
    MotionGoToXY = "motion_gotoxy",
    MotionGlideTo = "motion_glideto",
    MotionGlideSecsToXY = "motion_glidesecstoxy",
    MotionPointInDirection = "motion_pointindirection",
    MotionPointTowards = "motion_pointtowards",
    MotionChangeXBy = "motion_changexby",
    MotionSetX = "motion_setx",
    MotionChangeYBy = "motion_changeyby",
    MotionSetY = "motion_sety",
    MotionIfOnEdgeBounce = "motion_ifonedgebounce",
    MotionSetRotationStyle = "motion_setrotationstyle",
    MotionXPosition = "motion_xposition",
    MotionYPosition = "motion_yposition",
    MotionDirection = "motion_direction",

    LooksSayForSecs = "looks_sayforsecs",
    LooksSay = "looks_say",
    LooksThinkForSecs = "looks_thinkforsecs",
    LooksThink = "looks_think",
    LooksSwitchCostumeTo = "looks_switchcostumeto",
    LooksNextCostume = "looks_nextcostume",
    LooksSwitchBackdropTo = "looks_switchbackdropto",
    LooksNextBackdrop = "looks_nextbackdrop",
    LooksChangeSizeBy = "looks_changesizeby",
    LooksSetSizeTo = "looks_setsizeto",
    LooksChangeEffectBy = "looks_changeeffectby",
    LooksSetEffectTo = "looks_seteffectto",
    LooksClearGraphicEffects = "looks_cleargraphiceffects",
    LooksShow = "looks_show",
    LooksHide = "looks_hide",
    LooksGoToFrontBack = "looks_gotofrontback",
    LooksGoForwardBackwardLayers = "looks_goforwardbackwardlayers",
    LooksCostumeNumberName = "looks_costumenumbername",
    LooksBackdropNumberName = "looks_backdropnumbername",
    LooksSize = "looks_size",

    SoundPlayUntilDone = "sound_playuntildone",
    SoundPlay = "sound_play",
    SoundStopAllSounds = "sound_stopallsounds",
    SoundChangeEffectBy = "sound_changeeffectby",
    SoundSetEffectTo = "sound_seteffectto",
    SoundClearEffects = "sound_cleareffects",
    SoundChangeVolumeBy = "sound_changevolumeby",
    SoundSetVolumeTo = "sound_setvolumeto",
    SoundVolume = "sound_volume",

    EventWhenFlagClicked = "event_whenflagclicked",
    EventWhenKeyPressed = "event_whenkeypressed",
    EventWhenThisSpriteClicked = "event_whenthisspriteclicked",
    EventWhenStageClicked = "event_whenstageclicked",
    EventWhenBackdropSwitchesTo = "event_whenbackdropswitchesto",
    EventWhenGreaterThan = "event_whengreaterthan",
    EventWhenBroadcastReceived = "event_whenbroadcastreceived",
    EventBroadcast = "event_broadcast",
    EventBroadcastAndWait = "event_broadcastandwait",

    ControlWait = "control_wait",
    ControlRepeat = "control_repeat",
    ControlForever = "control_forever",
    ControlIf = "control_if",
    ControlIfElse = "control_if_else",
    ControlWaitUntil = "control_wait_until",
    ControlRepeatUntil = "control_repeat_until",
    ControlStop = "control_stop",
    ControlStartAsClone = "control_start_as_clone",
    ControlCreateCloneOf = "control_create_clone_of",
    ControlDeleteThisClone = "control_delete_this_clone",

    SensingTouchingObject = "sensing_touchingobject",
    SensingTouchingColor = "sensing_touchingcolor",
    SensingColorIsTouchingColor = "sensing_coloristouchingcolor",
    SensingDistanceTo = "sensing_distanceto",
    SensingAskAndWait = "sensing_askandwait",
    SensingAnswer = "sensing_answer",
    SensingKeyPressed = "sensing_keypressed",
    SensingMouseDown = "sensing_mousedown",
    SensingMouseX = "sensing_mousex",
    SensingMouseY = "sensing_mousey",
    SensingSetDragMode = "sensing_setdragmode",
    SensingLoudness = "sensing_loudness",
    SensingTimer = "sensing_timer",
    SensingResetTimer = "sensing_resettimer",
    SensingOf = "sensing_of",
    SensingCurrent = "sensing_current",
    SensingDaysSince2000 = "sensing_dayssince2000",
    SensingUsername = "sensing_username",

    OperatorAdd = "operator_add",
    OperatorSubtract = "operator_subtract",
    OperatorMultiply = "operator_multiply",
    OperatorDivide = "operator_divide",
    OperatorRandom = "operator_random",
    OperatorGreaterThan = "operator_gt",
    OperatorLessThan = "operator_lt",
    OperatorEquals = "operator_equals",
    OperatorAnd = "operator_and",
    OperatorOr = "operator_or",
    OperatorNot = "operator_not",
    OperatorJoin = "operator_join",
    OperatorLetterOf = "operator_letter_of",
    OperatorLength = "operator_length",
    OperatorContains = "operator_contains",
    OperatorMod = "operator_mod",
    OperatorRound = "operator_round",
    OperatorMathOp = "operator_mathop",

    DataVariable = "data_variable",
    DataSetVariableTo = "data_setvariableto",
    DataChangeVariableBy = "data_changevariableby",
    DataShowVariable = "data_showvariable",
    DataHideVariable = "data_hidevariable",
    DataListContents = "data_listcontents",
    DataAddToList = "data_addtolist",
    DataDeleteOfList = "data_deleteoflist",
    DataDeleteAllOfList = "data_deletealloflist",
    DataInsertAtList = "data_insertatlist",
    DataReplaceItemOfList = "data_replaceitemoflist",
    DataItemOfList = "data_itemoflist",
    DataItemNumOfList = "data_itemnumoflist",
    DataLengthOfList = "data_lengthoflist",
    DataListContainsItem = "data_listcontainsitem",
    DataShowList = "data_showlist",
    DataHideList = "data_hidelist",

    ProceduresDefinition = "procedures_definition",
    ProceduresPrototype = "procedures_prototype",
    ArgumentReporterBoolean = "argument_reporter_boolean",
    ArgumentReporterStringNumber = "argument_reporter_string_number",
    ProceduresCall = "procedures_call",

    // Extensions
    MusicPlayDrumForBeats = "music_playDrumForBeats",
    MusicRestForBeats = "music_restForBeats",
    MusicPlayNoteForBeats = "music_playNoteForBeats",
    MusicSetInstrument = "music_setInstrument",
    MusicSetTempo = "music_setTempo",
    MusicChangeTempo = "music_changeTempo",
    MusicGetTempo = "music_getTempo",

    PenClear = "pen_clear",
    PenStamp = "pen_stamp",
    PenPenDown = "pen_penDown",
    PenPenUp = "pen_penUp",
    PenSetPenColorToColor = "pen_setPenColorToColor",
    PenChangePenColorParamBy = "pen_changePenColorParamBy",
    PenSetPenColorParamTo = "pen_setPenColorParamTo",
    PenChangePenSizeBy = "pen_changePenSizeBy",
    PenSetPenSizeTo = "pen_setPenSizeTo",

    VideoSensingWhenMotionGreaterThan = "videoSensing_whenMotionGreaterThan",
    VideoSensingVideoOn = "videoSensing_videoOn",
    VideoSensingVideoToggle = "videoSensing_videoToggle",
    VideoSensingSetVideoTransparency = "videoSensing_setVideoTransparency",

    WeDo2MotorOnFor = "wedo2_motorOnFor",
    WeDo2MotorOn = "wedo2_motorOn",
    WeDo2MotorOff = "wedo2_motorOff",
    WeDo2StartMotorPower = "wedo2_startMotorPower",
    WeDo2SetMotorDirection = "wedo2_setMotorDirection",
    WeDo2SetLightHue = "wedo2_setLightHue",
    WeDo2WhenDistance = "wedo2_whenDistance",
    WeDo2WhenTilted = "wedo2_whenTilted",
    WeDo2GetDistance = "wedo2_getDistance",
    WeDo2IsTilted = "wedo2_isTilted",
    WeDo2GetTiltAngle = "wedo2_getTiltAngle",

    // Deprecated
    MotionScrollRight = "motion_scroll_right",
    MotionScrollUp = "motion_scroll_up",
    MotionAlignScene = "motion_align_scene",
    MotionXScroll = "motion_xscroll",
    MotionYScroll = "motion_yscroll",

    LooksHideAllSprites = "looks_hideallsprites",
    LooksSwitchBackdropToAndWait = "looks_switchbackdroptoandwait",
    LooksChangeStretchBy = "looks_changestretchby",
    LooksSetStretchTo = "looks_setstretchto",

    ControlWhile = "control_while",
    ControlForEach = "control_for_each",
    ControlGetCounter = "control_get_counter",
    ControlIncrCounter = "control_incr_counter",
    ControlClearCounter = "control_clear_counter",
    ControlAllAtOnce = "control_all_at_once",

    SensingUserId = "sensing_userid",
    SensingLoud = "sensing_loud",

    MusicMidiPlayDrumForBeats = "music_midiPlayDrumForBeats",
    MusicMidiSetInstrument = "music_midiSetInstrument",

    PenSetPenShadeToNumber = "pen_setPenShadeToNumber",
    PenChangePenShadeBy = "pen_changePenShadeBy",
    PenSetPenHueToNumber = "pen_setPenHueToNumber",
    PenChangePenHueBy = "pen_changePenHueBy",

    WeDo2PlayNoteFor = "wedo2_playNoteFor",

    /*********
     * MENUS *
     *********/
    MotionPointTowardsMenu = "motion_pointtowards_menu",
    MotionGlideToMenu = "motion_glideto_menu",
    MotionGoToMenu = "motion_goto_menu",

    LooksCostume = "looks_costume",
    LooksBackdrops = "looks_backdrops",

    SoundSoundsMenu = "sound_sounds_menu",

    EventBroadcastMenu = "broadcast_menu",

    ControlCreateCloneOfMenu = "control_create_clone_of_menu",

    SensingTouchingObjectMenu = "sensing_touchingobjectmenu",
    SensingDistanceToMenu = "sensing_distancetomenu",
    SensingKeyOptions = "sensing_keyoptions",
    SensingOfObjectMenu = "sensing_of_object_menu",

    PenMenuColorParam = "pen_menu_colorParam",

    MusicMenuDrum = "music_menu_DRUM",
    MusicMenuInstrument = "music_menu_INSTRUMENT",

    Note = "note",

    VideoSensingMenuAttribute = "videoSensing_menu_ATTRIBUTE",
    VideoSensingMenuSubject = "videoSensing_menu_SUBJECT",
    VideoSensingMenuVideoState = "videoSensing_menu_VIDEO_STATE",

    WeDo2MenuMotorId = "wedo2_menu_MOTOR_ID",
    WeDo2MenuMotorDirection = "wedo2_menu_MOTOR_DIRECTION",
    WeDo2MenuTiltDirection = "wedo2_menu_TILT_DIRECTION",
    WeDo2MenuTiltDirectionAny = "wedo2_menu_TILT_DIRECTION_ANY",
    WeDo2MenuOp = "wedo2_menu_OP"
}

export interface typeData {
    isStaticValue: boolean,
    blockId: string | null,
    block: any | null
}

export interface BlockClustering {
    blocks: { [key: string]: Block };

    addBlocks(blocks: { [key: string]: Block }): void;
}

export interface Block {
    opcode: BlockOpCode;
    next: string | null;
    parent: string | null;
    inputs: {
        [key: string]: any;
    };
    fields: {
        [key: string]: any;
    };
    shadow: boolean;
    topLevel: boolean;
    x: number;
    y: number;
}

export interface Mutation extends Block {
    mutation: {
        tagName?: "mutation";
        children?: [];
        hasnext?: string;
        proccode?: string;
        argumentids?: string;
        argumentnames?: string;
        argumentdefaults?: string;
        warp?: string;
    };
}

export interface buildData {
    instruction: number,
    originalSource: string,
    packages: { [key: string]: any }
}

/**
 * Creates a scratch block
 * @constructor
 * @returns - the scratch black
 */
export function createBlock({
    opcode = BlockOpCode.EventWhenFlagClicked, // The Block
    next = null, // The next Block
    parent = null, // The previous Block
    inputs = {}, // User-Defined Inputs
    fields = {}, // User-Defined Fields
    shadow = false, // Rendering
    topLevel = false, // If the block is at the top of a chain
    x = 0, // X Pos
    y = 0, // Y Pos
}: Partial<Block | Mutation> = {}): Block
{
    return {
        opcode: opcode,
        next: next,
        parent: parent,
        inputs: inputs,
        fields: fields,
        shadow: shadow,
        topLevel: topLevel,
        x: x,
        y: y,
    }
}

/**
 * Returns an internal function, that creates a function, that returns a scratch-block, like the `motion.goto` block. `t` is the return type.
 * @constructor
 * @param data - How the function should work internally.
 * @returns - A function that generates a scratch-block.
 */
export function createFunction<t = void>(
    data: {
        parseArguments?: boolean,
        minimumArguments?: number,
        maximumArguments?: number,
        argTypes?: string[],
        body: (
            callExpression: CallExpression,
            blockCluster: BlockClustering,
            parentId: string,
            buildData: buildData,
            parsedArguments?: typeData[],
        ) => t
    },
): (data: {
    parsedArguments?: typeData[],
    callExpression: CallExpression,
    blockCluster: BlockClustering,
    parentId: string,
    buildData: buildData
}) => t {
    return (() => {
        return (0 as t)
    })
};

/**
 * Returns an internal function, that creates a function, that returns a scratch-value, like the `operation.join` block.
 * @constructor
 * @param data - How the function should work internally.
 * @returns - A function that generates a scratch-value.
 */
export function createValueFunction(
    data: {
        parseArguments?: boolean,
        minimumArguments?: number,
        maximumArguments?: number,
        argTypes?: string[],
        body: (
            callExpression: CallExpression,
            blockCluster: BlockClustering,
            parentId: string,
            buildData: buildData,
            parsedArguments?: typeData[],
        ) => typeData
    },
): (data: {
    parsedArguments?: typeData[],
    callExpression: CallExpression,
    blockCluster: BlockClustering,
    parentId: string,
    buildData: buildData
}) => typeData {
    return (() => {
        return ({} as typeData)
    })
};

/**
 * Returns a group of internal functions, either created from `createFunction` or `createValueFunction`
 * @constructor
 * @param name - The name of the library
 * @param functions - An object containing functions
 * @returns - A library
 */
export function createLibrary(name: string, functions: {
    [key: string]: (data: {
        parsedArguments?: typeData[],
        callExpression: CallExpression,
        blockCluster: BlockClustering,
        parentId: string,
        buildData: buildData
    }) => any
}) {}

/**
 * Creates a new global keyword
 * @constructor
 * @param name - The name of the global
 * @param body - A function that returns the data
 * @returns - A global
 */
export function createGlobal(name: string, body: ((BlockCluster: BlockClustering) => typeData)) {}

/**
 * Creates an implementation for a `Babel` type. Allows you to extend JS2Scratch.
 * @constructor
 * @param type - The babel type to implement
 * @param body - A function that will be ran when the implementation is encountered.
 * @returns - An implementation
 */
export function createImplementation<t>(type: string, body: ((BlockCluster: BlockClustering, Object: t, buildData: buildData) => any)) {}