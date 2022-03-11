/*:
@target MZ
@plugindesc Quest任务系统 v1.0.1
@author うなぎおおとろ
@url https://raw.githubusercontent.com/unagiootoro/RPGMZ/master/QuestSystem.js
@help
部署任务系统的插件说明。

【汉化说明】
■汉化人：我想我是兔 Q.526915277  
■日期：2020/09/16
■说明：对工程范例和插件进行深入汉化，部分语句可能不太准确，但是内容基本能看得懂

【使用方法】
■创建任务
通过编辑插件参数“ QuestDatas”来创建任务。
使用此参数可以设置任务所需的项目，例如“请求”，“奖励”和“任务内容”。

■任务状态管理
每个任务都有一个状态（未接受，进行中，已领取等），该状态由变量管理。
变量值的含义如下。
0：未接受
未注册且未显示在列表中的任务
1：任务委托
未接受的委托任务
2：正在进行的任务
正在进行的已经领取的委托任务
3：完成任务领取
满足要求并可领取奖励的任务
4：已完成领取
完成的任务并且已经领取了奖励
5：任务失败
失败的任务
6：任务已过期
过期的任务
7：隐藏的任务
隐藏任务，仅显示轮廓

■关于任务插件执行的状态管理任务插件仅管理以下状态。
・收到任务委托后，将状态从未接受更改为进行中。
・完成任务时，将状态从可领取状态更改为已完成状态
・取消进行中的任务时，请将状态从进行中更改为未接受

如果要更改上述以外的状态，则需要使用event命令更改变量的值。

■领取奖励
提交完成的任务后，您将获得任务奖励。

■任务场景开始
可以通过以下两种方式启动任务场景。
・从菜单中调用“任务管理”
・执行插件命令“ StartQuest Scene”

假定主要如下适当地使用这两个。
插件命令：创建一个类似任务委托所的事件，您可以在其中领取委托和完成任务奖励。
菜单：检查每个任务的状态。

■任务命令
Quest命令用于管理任务分类以及用于领取任务和完成任务的命令。
*菜单中设置的插件命令和quest命令是默认设置的，因此基本用途无需更改。

有以下类型的任务命令。
all: 显示所有任务
questOrder: 显示未接受任务
orderingQuest: 查看正在进行的任务
questCancel: 取消正在进行的任务的任务委托
questReport: 完成并获得可完成任务的奖励
reportedQuest: 查看完成的任务
failedQuest: 显示失败的任务
expiredQuest: 显示过期的任务
hiddenQuest: 显示隐藏的任务

【执照】
根据MIT许可的条款，可以使用此插件。


@param QuestDatas
@text 任务数据
@type struct<QuestData>[]
@default []
@desc
注册任务数据。

@param EnabledQuestMenu
@text 菜单显示任务选项
@type boolean
@on 显示
@off 不显示
@default true
@desc
指定是否将任务管理选项添加到菜单。

@param EnabledQuestMenuSwitchId
@text Quest菜单激活开关ID
@type switch
@default 0
@desc
确定任务选项在菜单显示和不显示的开关ID

@param MenuCommands
@text 菜单显示命令
@type select[]
@option all
@option questOrder
@option orderingQuest
@option questCancel
@option questReport
@option reportedQuest
@option failedQuest
@option expiredQuest
@option hiddenQuest
@default ["orderingQuest","reportedQuest","all"]
@desc
指定菜单任务选项所显示的任务命令，参考帮助中--任务命令

@param DisplayDifficulty
@text 难易度显示
@type boolean
@on 显示
@off 不显示
@default true
@desc
指定是否显示请求难度。

@param DisplayPlace
@text 显示位置
@type boolean
@default true
@desc
指定是否显示任务的任务发布位置。

@param DisplayTimeLimit
@text 显示时间
@type boolean
@on 显示
@off 不显示
@default true
@desc
显示领取任务的时间。

@param QuestOrderSe
@text 领取任务SE
@type struct<QuestOrderSe>
@default {"FileName":"Skill1","Volume":"90","Pitch":"100","Pan":"0"}
@desc
成功领取委托任务时所播放的SE

@param QuestReportMe
@text 完成任务SE
@type struct<QuestReportMe>
@default {"FileName":"Item","Volume":"90","Pitch":"100","Pan":"0"}
@desc
完成委托任务领取奖励时播放的SE

@param WindowSize
@text 窗口的大小
@type struct<WindowSize>
@default {"CommandWindowWidth":"300","CommandWindowHeight":"160","DialogWindowWidth":"400","DialogWindowHeight":"160","GetRewardWindowWidth":"540","GetRewardWindowHeight":"160"}
@desc
设定各种窗口的大小。

@param Text
@text 显示文本
@type struct<Text>
@default {"MenuQuestSystemText":"クエスト確認","QuestOrderText":"このクエストを受けますか？","QuestOrderYesText":"受ける","QuestOrderNoText":"受けない","QuestCancelText":"このクエストをキャンセルしますか？","QuestCancelYesText":"キャンセルする","QuestCancelNoText":"キャンセルしない","QuestReportText":"このクエストを報告しますか？","QuestReportYesText":"報告する","QuestReportNoText":"報告しない","NothingQuestText":"該当するクエストはありません。","GetRewardText":"報酬として次のアイテムを受け取りました。","HiddenTitleText":"？？？？？？","AllCommandText":"全クエスト","QuestOrderCommandText":"クエストを受ける","OrderingQuestCommandText":"進行中のクエスト","QuestCancelCommandText":"クエストのキャンセル","QuestReportCommandText":"クエストを報告する","ReportedQuestCommandText":"報告済みのクエスト","FailedQuestCommandText":"失敗したクエスト","ExpiredQuestCommandText":"期限切れのクエスト","HiddenQuestCommandText":"未知のクエスト","NotOrderedStateText":"未受注","OrderingStateText":"進行中","ReportableStateText":"報告可","ReportedStateText":"報告済み","FailedStateText":"失敗","ExpiredStateText":"期限切れ","RequesterText":"【依頼者】：","RewardText":"【報酬】：","DifficultyText":"【難易度】：","PlaceText":"【場所】：","TimeLimitText":"【期間】："}
@desc
设置游戏中使用的文本。

@param TextColor
@text 显示文本颜色
@type struct<TextColor>
@default {"NotOrderedStateColor":"#ffffff","OrderingStateColor":"#ffffff","ReportableStateColor":"#ffffff","ReportedStateColor":"#ffffff","FailedStateColor":"#ffffff","ExpiredStateColor":"#ff0000"}
@desc
设置游戏中使用的文本颜色。

@param GoldIcon
@text 金币图标
@type number
@default 314
@desc
设置报酬栏中显示的金币的图标。


@command StartQuestScene
@text 任务场景开始
@desc 开始任务的场景

@arg QuestCommands
@type select[]
@option all
@option questOrder
@option orderingQuest
@option questCancel
@option questReport
@option reportedQuest
@option failedQuest
@option expiredQuest
@option hiddenQuest
@default ["questOrder","questCancel","questReport"]
@text 任务命令。
@desc 指定任务命令。


@command GetRewards
@text 获得奖励
@desc 获得任务的奖励。

@arg VariableId
@type number
@text 变量ID
@desc 指定获得报酬的请求的变量ID。


@command ChangeDetail
@text 更改请求详细信息
@desc 更改请求的详细信息。

@arg VariableId
@type number
@text 变量ID
@desc 指定要更改详细信息的请求的变量ID。

@arg Detail
@type string
@text 详细
@desc 设置要更改的请求详细信息。


@command ChangeRewards
@text 奖励更变
@desc 更改任务的奖励。

@arg VariableId
@type number
@text 变量ID
@desc 指定要更改奖励的请求的变量ID。

@arg Rewards
@type struct<Reward>[]
@text 奖励
@desc 设置要更改的任务的报酬。
*/


/*~struct~QuestData:
@param VariableId
@text 变量ID
@type variable
@desc
指定管理任务状态的变量。

@param Title
@text 标题
@type string
@desc
指定任务的标题。

@param IconIndex
@text 标题图标
@type number
@desc
指定要在任务标题中显示的图标。

@param Requester
@text 委托人姓名
@type string
@desc
指定请求的请求者名称。

@param Rewards
@text 奖励
@type struct<Reward>[]
@desc
指定任务的奖励。

@param Difficulty
@text 难度
@type string
@desc
指定任务的难度

@param Place
@text 地点
@type string
@desc
指定发布任务的地点。

@param TimeLimit
@text 有効期限
@type string
@desc
指定请求的到期时间

@param Detail
@text 任务信息
@type multiline_string
@desc
指定任务要求内容

@param HiddenDetail
@text 隐藏的信息
@type multiline_string
@desc
指定任务处于隐藏状态时的信息。
*/


/*~struct~Reward:
@param Type
@text 奖励的类型
@type select
@option 金币
@value gold
@option 物品
@value item
@option 武器
@value weapon
@option 防具
@value armor
@desc
指定奖励的类型(黄金、物品、武器或护具)。

@param GoldValue
@text 奖励金币数
@type number
@desc
指定报酬类型为金币时时获得的金币数量。

@param ItemId
@text 奖励物品ID
@type number
@desc
指定奖励类型未物品时获得的物品id

@param ItemCount
@text 奖励数量
@type number
@desc
指定奖励类型为物品时获得的项目数。
*/


/*~struct~QuestOrderSe:
@param FileName
@text 接受SE
@type file
@dir audio/se
@default Skill1
@desc
指定接受委托时播放的SE的文件名。

@param Volume
@text 接受SE音量
@type number
@default 90
@desc
指定接受委托时播放的SE的音量。

@param Pitch
@text 接受SE间距
@type number
@default 100
@desc
指定接受委托时播放的SE的间距。

@param Pan
@text 受注SE位相
@type number
@default 0
@desc
指定接受委托时播放的SE的位相。
*/


/*~struct~QuestReportMe:
@param FileName
@text 完成任务ME
@type file
@dir audio/me
@default Item
@desc
完成任务并领取奖励时播放的ME

@param Volume
@text 完成任务ME音量
@type number
@default 90
@desc
完成任务并领取奖励时播放的ME的音量。

@param Pitch
@text 完成任务ME间距
@type number
@default 100
@desc
完成任务并领取奖励时播放的ME的间距

@param Pan
@text 完成任务ME位相
@type number
@default 0
@desc
完成任务并领取奖励时播放的ME的位相
*/


/*~struct~WindowSize:
@param CommandWindowWidth
@text 命令窗口宽度。
@type number
@default 300
@desc
指定命令窗口的宽度

@param CommandWindowHeight
@text 命令窗口高度
@type number
@default 160
@desc
指定命令窗口的高度。

@param DialogWindowWidth
@text 对话方块视窗宽度
@type number
@default 400
@desc
对话方块视窗宽度

@param DialogWindowHeight
@text 对话方块视窗高度
@type number
@default 160
@desc
对话方块视窗高度

@param GetRewardWindowWidth
@text 奖励获得窗口宽度
@type number
@default 540
@desc
奖励获得窗口宽度

@param GetRewardWindowHeight
@text 奖励获得窗口高度
@type number
@default 160
@desc
奖励获得窗口高度
*/


/*~struct~Text:
@param MenuQuestSystemText
@text 菜单显示文本
@type string
@default クエスト確認
@desc
指定添加到菜单的选项名称。

@param QuestOrderText
@text クエスト受注テキスト
@type string
@default このクエストを受けますか？
@desc
クエストを受注する場合に表示するメッセージを指定します。

@param QuestOrderYesText
@text 受ける選択肢テキスト
@type string
@default 受ける
@desc
クエスト受注Yesの場合に表示するメッセージを指定します。

@param QuestOrderNoText
@text 受けない選択肢テキスト
@type string
@default 受けない
@desc
クエスト受注Noの場合に表示するメッセージを指定します。

@param QuestCancelText
@text キャンセル確認メッセージ
@type string
@default このクエストをキャンセルしますか？
@desc
クエストをキャンセルする場合に表示するメッセージを指定します。

@param QuestCancelYesText
@text キャンセルする選択肢テキスト
@type string
@default キャンセルする
@desc
クエスト受注キャンセルYesの場合に表示するメッセージを指定します。

@param QuestCancelNoText
@text キャンセルしない選択肢テキスト
@type string
@default キャンセルしない
@desc
クエスト受注キャンセルNoの場合に表示するメッセージを指定します。

@param QuestReportText
@text 報告確認メッセージ
@type string
@default このクエストを報告しますか？
@desc
クエスト報告時に表示するメッセージを指定します。

@param QuestReportYesText
@text 報告する選択肢テキスト
@type string
@default 報告する
@desc
クエスト報告Yesの場合に表示するメッセージを指定します。

@param QuestReportNoText
@text 報告しない選択肢テキスト
@type string
@default 報告しない
@desc
クエスト報告Noの場合に表示するメッセージを指定します。

@param NothingQuestText
@text クエストなしメッセージ
@type string
@default 該当するクエストはありません。
@desc
該当するクエストがない場合に表示するメッセージを指定します。

@param GetRewardText
@text 報酬受取メッセージ
@type string
@default 報酬として次のアイテムを受け取りました。
@desc
報酬を受け取った時に表示するメッセージを指定します。

@param HiddenTitleText
@text 隠しクエストのタイトル
@type string
@default ？？？？？？
@desc
隠しクエストのタイトルを指定します。

@param AllCommandText
@text 全クエスト表示コマンド
@type string
@default 全クエスト
@desc
全クエストを表示する場合のコマンド名を指定します。

@param QuestOrderCommandText
@text クエスト受託コマンド
@type string
@default クエストを受ける
@desc
クエストを受ける場合のコマンド名を指定します。

@param OrderingQuestCommandText
@text 進行中クエストコマンド
@type string
@default 進行中のクエスト
@desc
進行中のクエストを確認する場合のコマンド名を指定します。

@param QuestCancelCommandText
@text クエストキャンセルコマンド
@type string
@default クエストのキャンセル
@desc
進行中のクエストをキャンセルする場合のコマンド名を指定します。

@param QuestReportCommandText
@text クエスト報告コマンド
@type string
@default クエストを報告する
@desc
クエストを報告する場合のコマンド名を指定します。

@param ReportedQuestCommandText
@text 報告済クエスト確認コマンド
@type string
@default 報告済みのクエスト
@desc
報告済みのクエストを確認する場合のコマンド名を指定します。

@param FailedQuestCommandText
@text 失敗クエスト確認コマンド
@type string
@default 失敗したクエスト
@desc
失敗したクエストを確認する場合のコマンド名を指定します。

@param ExpiredQuestCommandText
@text 期限切れクエスト確認コマンド
@type string
@default 期限切れのクエスト
@desc
期限切れのクエストを確認する場合のコマンド名を指定します。

@param HiddenQuestCommandText
@text 隠しクエスト確認コマンド
@type string
@default 未知のクエスト
@desc
隠しクエストを確認する場合のコマンド名を指定します。

@param NotOrderedStateText
@text 未受注テキスト
@type string
@default 未受注
@desc
未受注の状態のテキストを指定します。

@param OrderingStateText
@text 進行中テキスト
@type string
@default 進行中
@desc
進行中の状態のテキストを指定します。

@param ReportableStateText
@text 報告可能テキスト
@type string
@default 報告可
@desc
報告可能の状態のテキストを指定します。

@param ReportedStateText
@text 報告済みテキスト
@type string
@default 報告済み
@desc
報告済みの状態のテキストを指定します。

@param FailedStateText
@text 失敗テキスト
@type string
@default 失敗
@desc
失敗の状態のテキストを指定します。

@param ExpiredStateText
@text 期限切れテキスト
@type string
@default 期限切れ
@desc
期限切れの状態のテキストを指定します。

@param RequesterText
@text 依頼者テキスト
@type string
@default 【依頼者】：
@desc
依頼者のテキストを指定します。

@param RewardText
@text 報酬テキスト
@type string
@default 【報酬】：
@desc
報酬のテキストを指定します。

@param DifficultyText
@text 難易度テキスト
@type string
@default 【難易度】：
@desc
難易度のテキストを指定します。

@param PlaceText
@text 場所テキスト
@type string
@default 【場所】：
@desc
場所のテキストを指定します。

@param TimeLimitText
@text 期限テキスト
@type string
@default 【期間】：
@desc
期間のテキストを指定します。
*/


/*~struct~TextColor:
@param NotOrderedStateColor
@text 未受注テキスト色
@type string
@default #aaaaaa
@desc
未受注の状態のテキストのカラーを指定します。

@param OrderingStateColor
@text 進行中テキスト色
@type string
@default #ffffff
@desc
進行中の状態のテキストのカラーを指定します。

@param ReportableStateColor
@text 報告可能テキスト色
@type string
@default #ffff00
@desc
報告可能の状態のテキストのカラーを指定します。

@param ReportedStateColor
@text 報告済みテキスト色
@type string
@default #60ff60
@desc
報告済みの状態のテキストのカラーを指定します。

@param FailedStateColor
@text 失敗テキスト色
@type string
@default #0000ff
@desc
失敗の状態のテキストのカラーを指定します。

@param ExpiredStateColor
@text 期限切れテキスト色
@type string
@default #ff0000
@desc
期限切れの状態のテキストのカラーを指定します。
*/

const QuestSystemPluginName = document.currentScript.src.match(/.+\/(.+)\.js/)[1];

const QuestSystemAlias = (() => {
"use strict";

class PluginParamsParser {
    static parse(params, typeData, predictEnable = true) {
        return new PluginParamsParser(predictEnable).parse(params, typeData);
    }

    constructor(predictEnable = true) {
        this._predictEnable = predictEnable;
    }

    parse(params, typeData, loopCount = 0) {
        if (++loopCount > 255) throw new Error("endless loop error");
        const result = {};
        for (const name in typeData) {
            result[name] = this.convertParam(params[name], typeData[name], loopCount);
        }
        if (!this._predictEnable) return result;
        if (typeof params === "object" && !(params instanceof Array)) {
            for (const name in params) {
                if (result[name]) continue;
                const param = params[name];
                const type = this.predict(param);
                result[name] = this.convertParam(param, type, loopCount);
            }
        }
        return result;
    }

    convertParam(param, type, loopCount) {
        if (typeof type === "string") {
            return this.cast(param, type);
        } else if (typeof type === "object" && type instanceof Array) {
            const aryParam = JSON.parse(param);
            if (type[0] === "string") {
                return aryParam.map(strParam => this.cast(strParam, type[0]));
            } else {
                return aryParam.map(strParam => this.parse(JSON.parse(strParam), type[0]), loopCount);
            }
        } else if (typeof type === "object") {
            return this.parse(JSON.parse(param), type, loopCount);
        } else {
            throw new Error(`${type} is not string or object`);
        }
    }

    cast(param, type) {
        switch(type) {
        case "any":
            if (!this._predictEnable) throw new Error("Predict mode is disable");
            return this.cast(param, this.predict(param));
        case "string":
            return param;
        case "number":
            if (param.match(/\d+\.\d+/)) return parseFloat(param);
            return parseInt(param);
        case "boolean":
            return param === "true";
        default:
            throw new Error(`Unknow type: ${type}`);
        }
    }

    predict(param) {
        if (param.match(/^\d+$/) || param.match(/^\d+\.\d+$/)) {
            return "number";
        } else if (param === "true" || param === "false") {
            return "boolean";
        } else {
            return "string";
        }
    }
}

class ItemInfo {
    constructor(type, id) {
        this._type = type;
        this._id = id;
    }

    get type() { return this._type; }
    set type(_type) { this._type = _type; }
    get id() { return this._id; }
    set id(_id) { this._id = _id; }

    itemData() {
        switch (this._type) {
        case "item":
            return $dataItems[this._id];
        case "weapon":
            return $dataWeapons[this._id];
        case "armor":
            return $dataArmors[this._id];
        }
        throw new Error(`${this._type} is not found`);
    }
}

class RewardData {
    static fromParam(rewardParam) {
        if (rewardParam.Type === "gold") {
            return new RewardData("gold", { value: rewardParam.GoldValue });
        } else {
            const itemInfo = new ItemInfo(rewardParam.Type, rewardParam.ItemId);
            return new RewardData("item", { item: itemInfo, count: rewardParam.ItemCount });
        }
    }

    // type is "gold" or "item".
    // params is { value: number } or { item: ItemInfo, count: number }.
    constructor(type, params) {
        this._type = type;
        this._params = params;
    }

    get type() { return this._type; }
    get params() { return this._params };

    getReward() {
        if (this._type === "gold") {
            $gameParty.gainGold(this._params.value);
        } else {
            $gameParty.gainItem(this._params.item.itemData(), this._params.count);
        }
    }
}

class QuestData {
    static fromParam(questDataParam) {
        const variableId = questDataParam.VariableId;
        const title = questDataParam.Title;
        const iconIndex = questDataParam.IconIndex;
        const requester = questDataParam.Requester;
        const rewards = questDataParam.Rewards.map(rewardParam => {
            return RewardData.fromParam(rewardParam);
        });
        const difficulty = questDataParam.Difficulty;
        const place = questDataParam.Place;
        const timeLimit = questDataParam.TimeLimit;
        const detail = questDataParam.Detail;
        const hiddenDetail = questDataParam.HiddenDetail;
        return new QuestData(variableId, title, iconIndex, requester, rewards, difficulty, place, timeLimit, detail, hiddenDetail);
    }

    constructor(variableId, title, iconIndex, requester, rewards, difficulty, place, timeLimit, detail, hiddenDetail) {
        this._variableId = variableId;
        this._title = title;
        this._iconIndex = iconIndex;
        this._requester = requester;
        this._rewards = rewards;
        this._difficulty = difficulty;
        this._place = place;
        this._timeLimit = timeLimit;
        this._detail = detail;
        this._hiddenDetail = hiddenDetail;
    }

    get variableId() { return this._variableId; }
    get title() { return this._title; }
    get iconIndex() { return this._iconIndex; }
    get requester() { return this._requester; }
    get rewards() { return this._rewards; }
    get difficulty() { return this._difficulty; }
    get place() { return this._place; }
    get timeLimit() { return this._timeLimit; }
    get detail() { return this._detail; }
    get hiddenDetail() { return this._hiddenDetail; }

    set rewards(_rewards) { this._rewards = _rewards; }
    set detail(_detail) { this._detail = _detail; }

    state() {
        const data = STATE_LIST.find(data => data.value === $gameVariables.value(this._variableId));
        return data ? data.state : "none";
    }

    setState(state) {
        const data = STATE_LIST.find(data => data.state === state);
        if (data) $gameVariables.setValue(this._variableId, data.value);
    }

    getRewards() {
        for (const reward of this.rewards) {
            reward.getReward();
        }
    }

    stateText() {
        const data = STATE_LIST.find(data => data.state === this.state());
        return data.text;
    }

    stateTextColor() {
        const data = STATE_LIST.find(data => data.state === this.state());
        return data.color;
    }
}

// Parse plugin parameters.
const typeDefine = {
    MenuCommands: ["string"],
    QuestDatas: [{
        Rewards: [{}],
    }],
    QuestOrderSe: {},
    QuestReportMe: {},
    WindowSize: {},
    Text: {},
    TextColor: {},
};

const params = PluginParamsParser.parse(PluginManager.parameters(QuestSystemPluginName), typeDefine);

const QuestDatas = params.QuestDatas.map(questDataParam => {
    return QuestData.fromParam(questDataParam);
});

const EnabledQuestMenu = params.EnabledQuestMenu;
const EnabledQuestMenuSwitchId = params.EnabledQuestMenuSwitchId;
const MenuCommands = params.MenuCommands;
const DisplayDifficulty = params.DisplayDifficulty;
const DisplayPlace = params.DisplayPlace;
const DisplayTimeLimit = params.DisplayTimeLimit;
const GoldIcon = params.GoldIcon;

const QuestOrderSe = params.QuestOrderSe;
const QuestReportMe = params.QuestReportMe;
const WindowSize = params.WindowSize;
const Text = params.Text;
const TextColor = params.TextColor;

const STATE_LIST = [
    { state: "none", value: 0, text: "" },
    { state: "notOrdered", value: 1, text: Text.NotOrderedStateText, color: TextColor.NotOrderedStateColor },
    { state: "ordering", value: 2, text: Text.OrderingStateText, color: TextColor.OrderingStateColor },
    { state: "reportable", value: 3, text: Text.ReportableStateText, color: TextColor.ReportableStateColor },
    { state: "reported", value: 4, text: Text.ReportedStateText, color: TextColor.ReportedStateColor },
    { state: "failed", value: 5, text: Text.FailedStateText, color: TextColor.FailedStateColor },
    { state: "expired", value: 6, text: Text.ExpiredStateText, color: TextColor.ExpiredStateColor },
    { state: "hidden", value: 7, text: "", color: "#ffffff" },
];

const COMMAND_TABLE = {
    "all": { state: null, text: Text.AllCommandText },
    "questOrder": { state: ["notOrdered"], text: Text.QuestOrderCommandText },
    "orderingQuest": { state: ["ordering", "reportable"], text: Text.OrderingQuestCommandText },
    "questCancel": { state: ["ordering"], text: Text.QuestCancelCommandText },
    "questReport": { state: ["reportable"], text: Text.QuestReportCommandText },
    "reportedQuest": { state: ["reported"], text: Text.ReportedQuestCommandText },
    "failedQuest": { state: ["failed"], text: Text.FailedQuestCommandText },
    "expiredQuest": { state: ["expired"], text: Text.ExpiredQuestCommandText },
    "hiddenQuest": { state: ["hidden"], text: Text.HiddenQuestCommandText },
};

class Scene_QuestSystem extends Scene_MenuBase {
    prepare(commandList) {
        this._commandList = commandList;
    }

    create() {
        super.create();
        this.createQuestCommandWindow();
        this.createQuestListWindow();
        this.createQuestDetailWindow();
        this.createQuestOrderWindow();
        this.createQuestReportWindow();
        this.createQuestGetRewardWindow();
        this.createQuestCancelWindow();
    }

    start() {
        super.start();
        this._questCommandWindow.activate();
        this._questCommandWindow.select(0);
        this._questDetailWindow.setDrawState("undraw");
        this._questCommandWindow.refresh();
        this.resetQuestList();
    }

    update() {
        super.update();
    }

    createQuestCommandWindow() {
        this._questCommandWindow = new Window_QuestCommand(this.questCommandWindowRect(), this._commandList);
        this._questCommandWindow.setHandler("ok", this.onQuestCommandOk.bind(this));
        this._questCommandWindow.setHandler("cancel", this.onQuestCommandCancel.bind(this));
        this._questCommandWindow.setHandler("select", this.onQuestCommandSelect.bind(this));
        this.addWindow(this._questCommandWindow);
    }

    createQuestListWindow() {
        this._questListWindow = new Window_QuestList(this.questListWindowRect());
        this._questListWindow.setHandler("ok", this.onQuestListOk.bind(this));
        this._questListWindow.setHandler("cancel", this.onQuestListCancel.bind(this));
        this._questListWindow.setHandler("select", this.onQuestListSelect.bind(this));
        this.addWindow(this._questListWindow);
    }

    createQuestDetailWindow() {
        this._questDetailWindow = new Window_QuestDetail(this.questDetailWindowRect());
        this.addWindow(this._questDetailWindow);
    }

    createQuestOrderWindow() {
        this._questOrderWindow = new Window_QuestOrder(this.questOrderWindowRect());
        this._questOrderWindow.setHandler("yes", this.onQuestOrderOk.bind(this));
        this._questOrderWindow.setHandler("no", this.onQuestOrderCancel.bind(this));
        this._questOrderWindow.setHandler("cancel", this.onQuestOrderCancel.bind(this));
        this.addWindow(this._questOrderWindow);
    }

    createQuestReportWindow() {
        this._questReportWindow = new Window_QuestReport(this.questReportWindowRect());
        this._questReportWindow.setHandler("yes", this.onQuestReportOk.bind(this));
        this._questReportWindow.setHandler("no", this.onQuestReportCancel.bind(this));
        this._questReportWindow.setHandler("cancel", this.onQuestReportCancel.bind(this));
        this.addWindow(this._questReportWindow);
    }

    createQuestGetRewardWindow() {
        this._questGetRewardWindow = new Window_QuestGetReward(this.questGetRewardWindowRect());
        this._questGetRewardWindow.setHandler("ok", this.onQuestGetRewardOk.bind(this));
        this.addWindow(this._questGetRewardWindow);
    }

    createQuestCancelWindow() {
        this._questCancelWindow = new Window_QuestCancel(this.questCancelWindowRect());
        this._questCancelWindow.setHandler("yes", this.onQuestCancelOk.bind(this));
        this._questCancelWindow.setHandler("no", this.onQuestCancelCancel.bind(this));
        this._questCancelWindow.setHandler("cancel", this.onQuestCancelCancel.bind(this));
        this.addWindow(this._questCancelWindow);
    }

    // Window rectangle
    questCommandWindowRect() {
        const x = 0;
        let y = 0;
        if (!this.isBottomButtonMode()) y += this.buttonAreaHeight();
        const w = WindowSize.CommandWindowWidth;
        const h = WindowSize.CommandWindowHeight;
        return new Rectangle(x, y, w, h);
    }

    questListWindowRect() {
        const questCommandWindowRect = this.questCommandWindowRect();
        const x = 0;
        const y = questCommandWindowRect.y + questCommandWindowRect.height;
        const w = WindowSize.CommandWindowWidth;
        const bottom = (this.isBottomButtonMode() ? Graphics.boxHeight - this.buttonAreaHeight() : Graphics.boxHeight);
        const h = bottom - y;
        return new Rectangle(x, y, w, h);
    }

    questDetailWindowRect() {
        const questCommandWindowRect = this.questCommandWindowRect();
        const questListWindowRect = this.questListWindowRect();
        const x = questListWindowRect.x + questListWindowRect.width;
        const y = questCommandWindowRect.y;
        const w = Graphics.boxWidth - x;
        const h = questCommandWindowRect.height + questListWindowRect.height;
        return new Rectangle(x, y, w, h);
    }

    questOrderWindowRect() {
        const w = WindowSize.DialogWindowWidth;
        const h = WindowSize.DialogWindowHeight;
        const x = Graphics.boxWidth / 2 - w / 2;
        const y = Graphics.boxHeight / 2 - h / 2;
        return new Rectangle(x, y, w, h);
    }

    questReportWindowRect() {
        return this.questOrderWindowRect();
    }

    questGetRewardWindowRect() {
        const w = WindowSize.GetRewardWindowWidth;
        const h = WindowSize.GetRewardWindowHeight;
        const x = Graphics.boxWidth / 2 - w / 2;
        const y = Graphics.boxHeight / 2 - h / 2;
        return new Rectangle(x, y, w, h);
    }

    questCancelWindowRect() {
        return this.questOrderWindowRect();
    }

    // Define window handlers
    onQuestCommandOk() {
        this.change_QuestCommandWindow_To_QuestListWindow();
        this.onQuestListSelect();
    }

    onQuestCommandCancel() {
        this.popScene();
    }

    onQuestCommandSelect() {
        this.resetQuestList();
    }

    onQuestListOk() {
        switch(this._questCommandWindow.currentSymbol()) {
        case "questOrder":
            this.change_QuestListWindow_To_QuestOrderWindow();
            break;
        case "questCancel":
            this.change_QuestListWindow_To_QuestCancelWindow();
            break;
        case "questReport":
            this.change_QuestListWindow_To_QuestReportWindow();
            break;
        default:
            this._questListWindow.activate();
            break;
        }
    }

    onQuestListCancel() {
        this.change_QuestListWindow_To_QuestCommandWindow();
    }

    onQuestListSelect() {
        if (this._questListWindow.currentSymbol()) {
            this._questDetailWindow.setQuestData(this._questListWindow.questData());
        } else {
            this._questDetailWindow.setQuestData(null);
        }
        this._questDetailWindow.setDrawState("draw");
        this._questDetailWindow.refresh();
    }

    onQuestOrderOk() {
        const questData = this._questListWindow.questData();
        questData.setState("ordering");
        this.change_QuestOrderWindow_To_QuestListWindow();
        this.resetQuestList();
        this._questListWindow.select(0);
        this._questDetailWindow.refresh();
    }

    onQuestOrderCancel() {
        this.change_QuestOrderWindow_To_QuestListWindow();
    }

    onQuestReportOk() {
        const questData = this._questListWindow.questData();
        questData.setState("reported");
        this.change_QuestReportWindow_To_QuestGetRewardWindow();
        this._questGetRewardWindow.setQuestData(questData);
        this._questGetRewardWindow.refresh();
    }

    onQuestReportCancel() {
        this.change_QuestReportWindow_To_QuestListWindow();
    }

    onQuestGetRewardOk() {
        const questData = this._questListWindow.questData();
        questData.getRewards();
        this.change_QuestGetRewardWindow_To_QuestListWindow();
        this.resetQuestList();
        this._questListWindow.select(0);
        this._questDetailWindow.refresh();
    }

    onQuestCancelOk() {
        const questData = this._questListWindow.questData();
        questData.setState("notOrdered");
        this.change_QuestCancelWindow_To_QuestListWindow();
        this.resetQuestList();
        this._questListWindow.select(0);
        this._questDetailWindow.refresh();
    }

    onQuestCancelCancel() {
        this.change_QuestCancelWindow_To_QuestListWindow();
    }

    // Change window
    change_QuestCommandWindow_To_QuestListWindow() {
        this._questCommandWindow.deactivate();
        this._questListWindow.show();
        this._questListWindow.activate();
        this._questListWindow.select(0);
    }

    change_QuestListWindow_To_QuestCommandWindow() {
        this._questDetailWindow.setQuestData(null);
        this._questDetailWindow.setDrawState("undraw");
        this._questDetailWindow.refresh();
        this._questListWindow.deactivate();
        this._questListWindow.select(-1);
        this._questCommandWindow.activate();
    }

    change_QuestListWindow_To_QuestOrderWindow() {
        this._questListWindow.deactivate();
        this._questOrderWindow.show();
        this._questOrderWindow.open();
        this._questOrderWindow.activate();
        this._questOrderWindow.select(0);
    }

    change_QuestListWindow_To_QuestReportWindow() {
        this._questListWindow.deactivate();
        this._questReportWindow.show();
        this._questReportWindow.open();
        this._questReportWindow.activate();
        this._questReportWindow.select(0);
    }

    change_QuestOrderWindow_To_QuestListWindow() {
        this._questOrderWindow.close();
        this._questOrderWindow.deactivate();
        this._questOrderWindow.select(-1);
        this._questListWindow.activate();
    }

    change_QuestReportWindow_To_QuestListWindow() {
        this._questReportWindow.close();
        this._questReportWindow.deactivate();
        this._questReportWindow.select(-1);
        this._questListWindow.activate();
    }

    change_QuestReportWindow_To_QuestGetRewardWindow() {
        this._questReportWindow.close();
        this._questReportWindow.deactivate();
        this._questReportWindow.select(-1);
        this._questGetRewardWindow.show();
        this._questGetRewardWindow.open();
        this._questGetRewardWindow.activate();
    }

    change_QuestGetRewardWindow_To_QuestListWindow() {
        this._questGetRewardWindow.close();
        this._questGetRewardWindow.deactivate();
        this._questListWindow.activate();
    }

    change_QuestListWindow_To_QuestCancelWindow() {
        this._questListWindow.deactivate();
        this._questCancelWindow.show();
        this._questCancelWindow.open();
        this._questCancelWindow.activate();
        this._questCancelWindow.select(-1);
    }

    change_QuestCancelWindow_To_QuestListWindow() {
        this._questCancelWindow.close();
        this._questCancelWindow.deactivate();
        this._questCancelWindow.select(-1);
        this._questListWindow.activate();
    }

    // Reset quest list window.
    resetQuestList() {
        this._questListWindow.resetQuestList(this._questCommandWindow.filterQuestList());
    }
}

class Window_QuestCommand extends Window_Command {
    initialize(rect, commandList) {
        this._commandList = commandList;
        super.initialize(rect);
        this.deactivate();
        this.select(-1);
    }

    select(index) {
        super.select(index);
        if (this.active && index >= 0) this.callHandler("select");
    }

    makeCommandList() {
        for (const command of this._commandList) {
            const commandData = COMMAND_TABLE[command];
            if (commandData) {
                this.addCommand(commandData.text, command);
            } else {
                throw new Error(`Unknow quest command ${command}`);
            }
        }
    }

    filterQuestList() {
        if (this.currentSymbol() === "all") return QuestDatas.filter(data => data.state() !== "none");
        const commandData = COMMAND_TABLE[this.currentSymbol()];
        return QuestDatas.filter(quest => commandData.state.includes(quest.state()));
    }
}

class Window_QuestList extends Window_Command {
    initialize(rect) {
        this._questList = [];
        super.initialize(rect);
        this.deactivate();
        this.select(-1);
    }

    select(index) {
        super.select(index);
        if (this.active && index >= 0) this.callHandler("select");
    }

    resetQuestList(questList) {
        this.clearCommandList();
        this._questList = questList;
        this.refresh();
    }

    questData() {
        return this._questList[this.index()];
    }

    makeCommandList() {
        for (let i = 0; i < this._questList.length; i++) {
            const questData = this._questList[i];
            const title = (questData.state() === "hidden" ? Text.HiddenTitleText : questData.title);
            this.addCommand(title, `quest${i}`);
        }
    }

    drawItem(index) {
        const rect = this.itemLineRect(index);
        this.resetTextColor();
        this.changePaintOpacity(this.isCommandEnabled(index));
        const questData = this._questList[index];
        if (questData.iconIndex === 0) {
            this.drawText(this.commandName(index), rect.x, rect.y, rect.width, "left");
        } else {
            const text = { name: this.commandName(index), iconIndex: questData.iconIndex };
            this.drawItemName(text, rect.x, rect.y, rect.width);
        }
    }
}

class Window_QuestDetail extends Window_Selectable {
    initialize(rect) {
        super.initialize(rect);
        this._questData = null;
        this._drawState = "undraw";
        this.deactivate();
    }

    setQuestData(questData) {
        this._questData = questData;
    }

    // undraw: Unraw window
    // draw: Draw window
    setDrawState(drawState) {
        this._drawState = drawState;
    }

    infoTextWidth() {
        return 160;
    }

    messageX() {
        return this.infoTextWidth() + 16;
    }

    messageWindth() {
        return this.width - this.padding * 2 - this.messageX();
    }

    drawAllItems() {
        if (this._drawState === "draw" && !this._questData) {
            this.drawNothingQuest(0);
        } else if (this._drawState === "draw" && this._questData.state() === "hidden") {
            this.drawHiddenDetail(0);
        } else if (this._drawState === "draw") {
            let startLine = 0;
            this.drawTitle(startLine);
            startLine += 1;
            this.drawRequester(startLine);
            startLine += 1.25;
            this.drawRewards(startLine);
            startLine += this._questData.rewards.length;
            if (DisplayDifficulty) {
                this.drawDifficulty(startLine);
                startLine += 1;
            }
            if (DisplayPlace) {
                this.drawPlace(startLine);
                startLine += 1;
            }
            if (DisplayTimeLimit) {
                this.drawTimeLimit(startLine);
                startLine += 1;
            }
            this.drawDetail(startLine);
        }
    }

    drawNothingQuest(startLine) {
        this.drawTextEx(Text.NothingQuestText, this.padding, this.startY(startLine), this.width - this.padding * 2);
    }

    drawTitle(startLine) {
        this.resetTextColor();
        const width = this.width - this.padding * 4;
        if (this._questData.iconIndex === 0) {
            this.drawText(this._questData.title, this.padding, this.startY(startLine), width - 120, "left");
        } else {
            const text = { name: this._questData.title, iconIndex: this._questData.iconIndex };
            this.drawItemName(text, this.padding, this.startY(startLine), width - 120);
        }
        // TextColor
        this.changeTextColor(this._questData.stateTextColor());
        this.drawText(this._questData.stateText(), this.padding, this.startY(startLine), width, "right");
        this.resetTextColor();
    }

    drawRequester(startLine) {
        this.changeTextColor(this.systemColor());
        this.drawHorzLine(this.startY(startLine));
        this.drawText(Text.RequesterText, this.padding, this.startY(startLine + 0.25), this.infoTextWidth());
        this.resetTextColor();
        this.drawText(this._questData.requester, this.messageX(), this.startY(startLine + 0.25), this.messageWindth());
    }

    drawRewards(startLine) {
        this.changeTextColor(this.systemColor());
        this.drawText(Text.RewardText, this.padding, this.startY(startLine), this.infoTextWidth());
        this.resetTextColor();
        for (const reward of this._questData.rewards) {
            this.drawReward(reward, this.startY(startLine))
            startLine++;
        }
    }

    drawReward(reward, y) {
        if (reward.type === "gold") {
            const text = { name: `${reward.params.value}${TextManager.currencyUnit}`, iconIndex: GoldIcon };
            this.drawItemName(text, this.messageX(), y, this.messageWindth());
        } else if (reward.type === "item") {
            this.drawItemName(reward.params.item.itemData(), this.messageX(), y, this.messageWindth());
            const strItemCount = `×${reward.params.count}`;
            this.drawText(strItemCount, this.messageX(), y, this.messageWindth(), "right");
        }
    }

    drawDifficulty(startLine) {
        this.changeTextColor(this.systemColor());
        this.drawText(Text.DifficultyText, this.padding, this.startY(startLine), this.infoTextWidth());
        this.resetTextColor();
        this.drawText(this._questData.difficulty, this.messageX(), this.startY(startLine), this.messageWindth());
    }

    drawPlace(startLine) {
        this.changeTextColor(this.systemColor());
        this.drawText(Text.PlaceText, this.padding, this.startY(startLine), this.infoTextWidth());
        this.resetTextColor();
        this.drawText(this._questData.place, this.messageX(), this.startY(startLine), this.messageWindth());
    }

    drawTimeLimit(startLine) {
        this.changeTextColor(this.systemColor());
        this.drawText(Text.TimeLimitText, this.padding, this.startY(startLine), this.infoTextWidth());
        this.resetTextColor();
        this.drawText(this._questData.timeLimit, this.messageX(), this.startY(startLine), this.messageWindth());
    }

    drawDetail(startLine) {
        this.changeTextColor(this.systemColor());
        this.drawHorzLine(this.startY(startLine));
        this.resetTextColor();
        this.drawTextEx(this._questData.detail, this.padding, this.startY(startLine + 0.25), this.width - this.padding * 2);
    }

    drawHiddenDetail(startLine) {
        this.drawTextEx(this._questData.hiddenDetail, this.padding, this.startY(startLine), this.width - this.padding * 2);
    }

    startY(line) {
        return this.padding + this.itemHeight() * line;
    }

    drawHorzLine(y) {
        const padding = this.itemPadding();
        const x = padding;
        const width = this.innerWidth - padding * 2;
        this.drawRect(x, y, width, 5);
    }

    itemHeight() {
        return 32;
    }
}

class Window_QuestOrder extends Window_Command {
    initialize(rect) {
        super.initialize(rect);
        this.deactivate();
        this.hide();
        this.close();
    }

    makeCommandList() {
        this.addCommand(Text.QuestOrderYesText, "yes");
        this.addCommand(Text.QuestOrderNoText, "no");
    }

    drawAllItems() {
        const rect = this.itemLineRect(0);
        rect.y = this.padding;
        this.drawText(Text.QuestOrderText, rect.x, rect.y, rect.width);
        super.drawAllItems();
    }

    itemRect(index) {
        return super.itemRect(index + 1);
    }

    playOkSound() {
        if (this.currentSymbol() === "yes") return this.playOrderSound();
        super.playOkSound();
    }

    playOrderSound() {
        if (QuestOrderSe.FileName === "") return;
        const se = {
            name: QuestOrderSe.FileName,
            pan: QuestOrderSe.Pan,
            pitch: QuestOrderSe.Pitch,
            volume: QuestOrderSe.Volume,
        }
        AudioManager.playSe(se);
    }
}

class Window_QuestCancel extends Window_Command {
    initialize(rect) {
        super.initialize(rect);
        this.deactivate();
        this.hide();
        this.close();
    }

    makeCommandList() {
        this.addCommand(Text.QuestCancelYesText, "yes");
        this.addCommand(Text.QuestCancelNoText, "no");
    }

    drawAllItems() {
        const rect = this.itemLineRect(0);
        rect.y = this.padding;
        this.drawText(Text.QuestCancelText, rect.x, rect.y, rect.width);
        super.drawAllItems();
    }

    itemRect(index) {
        return super.itemRect(index + 1);
    }
}

class Window_QuestReport extends Window_Command {
    initialize(rect) {
        super.initialize(rect);
        this.deactivate();
        this.hide();
        this.close();
    }

    makeCommandList() {
        this.addCommand(Text.QuestReportYesText, "yes");
        this.addCommand(Text.QuestReportNoText, "no");
    }

    drawAllItems() {
        const rect = this.itemLineRect(0);
        rect.y = this.padding;
        this.drawText(Text.QuestReportText, rect.x, rect.y, rect.width);
        super.drawAllItems();
    }

    itemRect(index) {
        return super.itemRect(index + 1);
    }

    playOkSound() {
        if (this.currentSymbol() === "yes") return this.playOrderSound();
        super.playOkSound();
    }

    playOrderSound() {
        if (QuestReportMe.FileName === "") return;
        const me = {
            name: QuestReportMe.FileName,
            pan: QuestReportMe.Pan,
            pitch: QuestReportMe.Pitch,
            volume: QuestReportMe.Volume,
        }
        AudioManager.playMe(me);
    }
}

class Window_QuestGetReward extends Window_Selectable {
    initialize(rect) {
        super.initialize(rect);
        this.deactivate();
        this.hide();
        this.close();
        this._questData = null;
    }

    onTouchOk() {
        this.processOk();
    }

    setQuestData(questData) {
        this._questData = questData;
    }

    drawAllItems() {
        const rect = this.itemLineRect(0);
        this.drawText(Text.GetRewardText, rect.x, rect.y, rect.width);
        this.drawRewards();
    }

    drawRewards() {
        let i = 1;
        for (const reward of this._questData.rewards) {
            const rect = this.itemLineRect(i);
            this.drawReward(reward, rect);
            i++;
        }
    }

    drawReward(reward, rect) {
        if (reward.type === "gold") {
            const text = { name: `${reward.params.value}${TextManager.currencyUnit}`, iconIndex: GoldIcon };
            this.drawItemName(text, rect.x, rect.y, rect.width);
        } else if (reward.type === "item") {
            this.drawItemName(reward.params.item.itemData(), rect.x, rect.y, rect.width);
            const strItemCount = `×${reward.params.count}`;
            this.drawText(strItemCount, rect.x, rect.y, rect.width, "right");
        }
    }
}


// Register plugin command.
PluginManager.registerCommand(QuestSystemPluginName, "StartQuestScene", args => {
    SceneManager.push(Scene_QuestSystem);
    const params = PluginParamsParser.parse(args, { QuestCommands: ["string"] });
    const commands = (params.QuestCommands.length === 0 ? null : params.QuestCommands);
    SceneManager.prepareNextScene(commands);
});

PluginManager.registerCommand(QuestSystemPluginName, "GetRewards", args => {
    const params = PluginParamsParser.parse(args, { VariableId: "number" });
    const questData = QuestDatas.find(data => data.variableId === params.VariableId);
    if (!questData) return;
    questData.getRewards();
});

PluginManager.registerCommand(QuestSystemPluginName, "ChangeDetail", args => {
    const params = PluginParamsParser.parse(args, { VariableId: "number", Detail: "string" });
    const questData = QuestDatas.find(data => data.variableId === params.VariableId);
    if (!questData) return;
    questData.detail = params.Detail;
});

PluginManager.registerCommand(QuestSystemPluginName, "ChangeRewards", args => {
    const params = PluginParamsParser.parse(args, { Rewards: [{}] });
    const questData = QuestDatas.find(data => data.variableId === params.VariableId);
    if (!questData) return;
    const rewards = params.Rewards.map(rewardParam => {
        return RewardData.fromParam(rewardParam);
    });
    questData.rewards = rewards;
});


// Add QuestSystem to menu command.
const _Window_MenuCommand_addOriginalCommands = Window_MenuCommand.prototype.addOriginalCommands;
Window_MenuCommand.prototype.addOriginalCommands = function() {
    _Window_MenuCommand_addOriginalCommands.call(this);
    if (EnabledQuestMenu) this.addCommand(Text.MenuQuestSystemText, "quest", this.isEnabledQuestMenu());
};

Window_MenuCommand.prototype.isEnabledQuestMenu = function() {
    if (EnabledQuestMenuSwitchId === 0) return true;
    return $gameSwitches.value(EnabledAlchemySwitchId);
};

const _Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
Scene_Menu.prototype.createCommandWindow = function() {
    _Scene_Menu_createCommandWindow.call(this);
    if (EnabledQuestMenu) this._commandWindow.setHandler("quest", this.quest.bind(this));
};

Scene_Menu.prototype.quest = function() {
    SceneManager.push(Scene_QuestSystem);
    SceneManager.prepareNextScene(MenuCommands);
};


// Define class alias.
return {
    ItemInfo: ItemInfo,
    RewardData: RewardData,
    QuestData: QuestData,
    Scene_QuestSystem: Scene_QuestSystem,
    Window_QuestCommand: Window_QuestCommand,
    Window_QuestList: Window_QuestList,
    Window_QuestDetail: Window_QuestDetail,
    Window_QuestOrder: Window_QuestOrder,
    Window_QuestCancel: Window_QuestCancel,
    Window_QuestReport: Window_QuestReport,
    Window_QuestGetReward: Window_QuestGetReward,
};

})();
