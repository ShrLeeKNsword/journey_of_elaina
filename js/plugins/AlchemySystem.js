﻿/*:
@target MZ
@plugindesc 项目合成插件 v1.0.3
@author うなぎおおとろ
@url https://raw.githubusercontent.com/unagiootoro/RPGMZ/master/AlchemySystem.js

@param EnabledMenuAlchemy
@type boolean
@default true
@desc
true设置时、将合成命令添加到菜单。

@param EnabledAlchemySwitchId
@type switch
@default 0
@desc
指定启用/禁用菜单组合的开关的ID。 如果指定0，则始终启用合成命令。。

@param EnabledGoldWindow
@type boolean
@default true
@desc
true如果设置为，则当前的黄金拥有量和项目组成所需的黄金将显示在组成屏幕上。。

@param DisplayKeyItemCategory
@type boolean
@default false
@desc
true如果设置为，则在撰写过程中重要项目列将显示在类别选择屏幕上。

@param MaxNumMakeItem
@type number
@default 999
@desc
指定一次可以合并的最大项目数。

@param MaxMaterials
@type number
@default 3
@desc
指定用于合成的材料类型的最大值。

@param MakeItemSeFileName
@type file
@dir audio/se
@default Heal5
@desc
指定合成项目时要播放的SE文件名。

@param MakeItemSeVolume
@type number
@default 90
@desc
指定合成项目时要播放的SE的音量。

@param MakeItemSePitch
@type number
@default 100
@desc
指定合成项目时要播放的SE音高。

@param MakeItemSePan
@type number
@default 0
@desc
指定合成项目时要播放的SE平移。

@param MenuAlchemyText
@type string
@default 合成
@desc
指定要在菜单中显示的撰写用语。

@param NeedMaterialText
@type string
@default 必要素材：
@desc
显示所需材料时指定措辞。

@param NeedPriceText
@type string
@default 必要経費：
@desc
必要経費を显示时指定措辞。

@param TargetItemText
@type string
@default 生成的项目：
@desc
在显示生成的项目时指定措辞。

@command StartAlchemyScene
@text 合成场景开始
@desc开始合成场景。

@help
-------------------------------
引入简单项目合成功能的插件。

使用方法
项目的合成可以通过获得配方来实现。
通过使配方作为普通项目持有，可以合成配方中注册的项目。

■配方的制作
在配方项目的备忘栏中以以下格式记载配方的内容。
<配方>
"材料":[素材项目信息1，素材项目信息2，... ]
"价格" :合成所需经费
" target " :合成结果项目信息


素材项目信息...是素材项目的信息。
指定以下格式: “标识符”、ID和数量
标识符...是表示项目属于普通项目/武器/护具中的哪一个的标识符。
指定“项目”、“weapon”、“机械臂”中的任意一个。
ID ...指定常规项目/武器/护具的ID。
个数...指定素材所需的项目个数。

合成所需经费...设定合成所需的费用。
这个项目是可选的。 如果省略的话，将变成0黄金。

合成项目信息...是作为合成结果创建的项目的信息。
指定以下格式: “标识符”，标识
标识符...是表示项目属于普通项目/武器/护具中的哪一个的标识符。
指定“项目”、“weapon”、“机械臂”中的任意一个。
ID ...指定常规项目/武器/护具的ID。

例如，在将1个高分辨率( ID: 8 )和2个魔术水( ID: 10 )合成而生成全分辨率( ID: 9 )情况下，
记载如下。
<配方>
材料: [“项目”，8，1 ]，“项目”，10，2 ]，
目标: [“项目”，9]


除了上述设定以外，合成所需经费设定为100G时，记载如下。
<配方>
材料: [“项目”，8，1 ]，“项目”，10，2 ]，
价格: 100，
目标: [“项目”，9]


■合成场景的开始
使用插件命令执行“StartAlchemyScene”后，将开始合成场景。

许可证
此插件在MIT许可的条件下可用。
-------------------
它是一个插件，引入了简单的项目组合功能。

[如何使用]
通过获取配方可以进行项目合成。
通过将配方作为常规项目，您将能够合成配方中注册的项目。。

■创建食谱
在配方项目的备注字段中以以下格式描述配方的内容。
<recipe>
"material": [物料项目信息1，物料项目信息2, ...]
"price": 综合所需的费用
"target": 综合结果项目信息</recipe>

物料项目信息...有关用作物料的项目的信息。
                  指定以下格式。 ["识别码", ID, 個数]
                  识别码...指示物品是否为普通物品/武器/盔甲的标识符。
                           "item", "weapon", "armor"指定以下之一。
                  ID...通常アイテム/武器/防具のIDを指定します。
                  個数...指定物料所需的项目数。

所需的合成成本...设定合成成本。
                此项是可选的。 如果省略，则为0金。

合并结果项目信息...关于合并结果创建的项目的信息。
                     次の形式で指定します。 ["识别码", ID]
                     识别码...指示物品是否为普通物品/武器/盔甲的标识符。
                              "item", "weapon", "armor"指定以下之一。
                     ID...通常条款/武器/防具のIDを指定做。。

例例如，如果您想通过组合一个较高的部分（ID：8）和两个魔术水（ID：10）来创建完整的部分（ID：9），
描述如下。
<recipe>
"material": [["item", 8, 1], ["item", 10, 2]],
"target": ["item", 9]
</recipe>

除上述设置外，如果您要为所需的综合成本设置100G，请输入以下内容。
<recipe>
"material": [["item", 8, 1], ["item", 10, 2]],
"price": 100,
"target": ["item", 9]
</recipe>

■复合场景的开始
使用插件命令「StartAlchemyScene」将开始合成场景。

[执照]
根据MIT许可的条款可以使用此插件。。
------------------
シンプルなアイテム合成機能を導入するプラグインです。

[使用方法]
アイテムの合成はレシピを入手することによって可能となります。
レシピは通常のアイテムとして持たせることによって、レシピに登録されたアイテムが合成できるようになります。

■レシピの作成
レシピアイテムのメモ欄に以下の形式でレシピの内容を記載します。
<recipe>
"material": [素材アイテム情報1, 素材アイテム情報2, ...]
"price": 合成の必要経費
"target": 合成結果アイテム情報
</recipe>

素材アイテム情報...素材となるアイテムの情報です。
                  次の形式で指定します。 ["識別子", ID, 個数]
                  識別子...アイテムが通常アイテム/武器/防具のどれに該当するのかを表す識別子です。
                           "item", "weapon", "armor"のいずれかを指定します。
                  ID...通常アイテム/武器/防具のIDを指定します。
                  個数...素材として必要なアイテムの個数を指定します。

合成の必要経費...合成にかかる費用を設定します。
                この項目は省略可能です。省略した場合は0ゴールドになります。

合成結果アイテム情報...合成した結果として作成されるアイテムの情報です。
                     次の形式で指定します。 ["識別子", ID]
                     識別子...アイテムが通常アイテム/武器/防具のどれに該当するのかを表す識別子です。
                              "item", "weapon", "armor"のいずれかを指定します。
                     ID...通常アイテム/武器/防具のIDを指定します。

例えば、ハイポーション(ID: 8)1つとマジックウォーター(ID: 10)2つを合成してフルポーション(ID: 9)を作成する場合、
次のように記載します。
<recipe>
"material": [["item", 8, 1], ["item", 10, 2]],
"target": ["item", 9]
</recipe>

上記の設定に加えて、合成の必要経費に100Gを設定する場合、次のように記載します。
<recipe>
"material": [["item", 8, 1], ["item", 10, 2]],
"price": 100,
"target": ["item", 9]
</recipe>

■合成シーンの開始
プラグインコマンドで「StartAlchemyScene」を実行すると、合成シーンを開始します。

[ライセンス]
このプラグインは、MITライセンスの条件の下で利用可能です。
*/

const AlchemyClassAlias = {};

(() => {
"use strict";

const pluginName = document.currentScript.src.match(/.+\/(.+)\.js/)[1];
const params = PluginManager.parameters(pluginName);

const EnabledMenuAlchemy = (params["EnabledMenuAlchemy"] === "true" ? true : false);
const EnabledAlchemySwitchId = parseInt(params["EnabledAlchemySwitchId"]);
const EnabledGoldWindow = (params["EnabledGoldWindow"] === "true" ? true : false);
const DisplayKeyItemCategory = (params["DisplayKeyItemCategory"] === "true" ? true : false);

const MaxNumMakeItem = parseInt(params["MaxNumMakeItem"]);
const MaxMaterials = parseInt(params["MaxMaterials"]);

const MakeItemSeFileName = params["MakeItemSeFileName"];
const MakeItemSeVolume = parseInt(params["MakeItemSeVolume"]);
const MakeItemSePitch = parseInt(params["MakeItemSePitch"]);
const MakeItemSePan = parseInt(params["MakeItemSePan"]);

const MenuAlchemyText = params["MenuAlchemyText"];
const NeedMaterialText = params["NeedMaterialText"];
const NeedPriceText = params["NeedPriceText"];
const TargetItemText = params["TargetItemText"];

let $recipes = null;

class ItemInfo {
    constructor(type, id) {
        this._type = type;
        this._id = id;
    }

    get type() { return this._type; }
    set type(_type) { this._type = _type; }
    get id() { return this._id; }
    set id(_id) { this._id = _id; }

    // Tag to completely specify the item.
    tag() {
        return `${this._type}_${this._id}`;
    }

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

    partyItemCount() {
        let count;
        switch (this._type) {
        case "item":
            count = $gameParty._items[this._id];
            break;
        case "weapon":
            count = $gameParty._weapons[this._id];
            break;
        case "armor":
            count = $gameParty._armors[this._id];
            break;
        default:
            throw new Error(`${this._type} is not found`);
        }
        if (count) return count;
        return 0;
    }
}

class Material {
    constructor(itemInfo, count) {
        this._itemInfo = itemInfo;
        this._count = count;
    }

    get itemInfo() { return this._itemInfo; }
    set itemInfo(_itemInfo) { this._itemInfo = _itemInfo; }
    get count() { return this._count; }
    set count(_count) { this._count = _count; }
}

class AlchemyRecipe {
    constructor(materials, price, targetItemInfo) {
        this._materials = materials;
        this._price = price;
        this._targetItemInfo = targetItemInfo;
    }

    materials() {
        return this._materials;
    }

    price() {
        return this._price;
    }

    targetItemInfo() {
        return this._targetItemInfo;
    }

    targetItemData() {
        return this._targetItemInfo.itemData();
    }

    needItemCount(itemInfo) {
        return this._materials[itemInfo.tag()].count;
    }

    hasItemCount(itemInfo) {
        return itemInfo.partyItemCount();
    }

    maxMakeItemCount() {
        const targetItem = this.targetItemData();
        const maxRemainingCount = $gameParty.maxItems(targetItem) - $gameParty.numItems(targetItem);
        if (maxRemainingCount <= 0) return 0;
        let makeItemCount = this.maxMakeItemCountNoLimit();
        if (makeItemCount > MaxNumMakeItem) makeItemCount = MaxNumMakeItem;
        return makeItemCount > maxRemainingCount ? maxRemainingCount : makeItemCount;
    }

    maxMakeItemCountNoLimit() {
        let minCount;
        minCount = (this._price > 0 ? Math.floor($gameParty.gold() / this._price) : MaxNumMakeItem);
        if (minCount === 0) return 0;
        for (const tag in this._materials) {
            const itemInfo = this._materials[tag].itemInfo;
            const count = Math.floor(this.hasItemCount(itemInfo) / this.needItemCount(itemInfo));
            if (count === 0) return 0;
            if (count < minCount) minCount = count;
        }
        return minCount;
    }

    canMakeItem() {
        return this.maxMakeItemCount() > 0;
    }

    makeItem(targetItemCount) {
        for (const tag in this._materials) {
            const material = this._materials[tag];
            $gameParty.gainItem(material.itemInfo.itemData(), -material.count * targetItemCount);
        }
        $gameParty.gainGold(-this._price * targetItemCount);
        $gameParty.gainItem(this.targetItemData(), targetItemCount);
    }
}

class Scene_Alchemy extends Scene_MenuBase {
    create() {
        super.create();
        this.createRecipes();
        this.createHelpWindow();
        this.createSelectRecipesWindow();
        this.createNumberWindow();
        this.createCategoryWindow();
        if (EnabledGoldWindow) this.createGoldWindow();
        this.createRecipeDetailWindow();
    }

    start() {
        super.start();
        this._categoryWindow.open();
        this._categoryWindow.activate();
        this._windowSelectRecipes.open();
        this._windowRecipeDetail.open();
        this._helpWindow.show();
    }

    createRecipes() {
        $recipes = [];
        for (const item of $gameParty.items()) {
            const matchData = item.note.match(/<recipe>(.+)<\/recipe>/s);
            if (!matchData) continue;
            const recipeData = JSON.parse("{" + matchData[1] + "}");
            const materials = {};
            for (const materialData of recipeData.material) {
                const itemInfo = new ItemInfo(materialData[0], materialData[1]);
                const material = new Material(itemInfo, materialData[2]);
                materials[itemInfo.tag()] = material;
            }
            const targetItemInfo = new ItemInfo(recipeData.target[0], recipeData.target[1]);
            const price = recipeData.price ? recipeData.price : 0;
            $recipes.push(new AlchemyRecipe(materials, price, targetItemInfo));
        }
    }

    createCategoryWindow() {
        this._categoryWindow = new Window_AlchemyCategory(this.categoryWindowRect());
        this._categoryWindow.setHelpWindow(this._helpWindow);
        this._categoryWindow.setHandler("ok",     this.onCategoryOk.bind(this));
        this._categoryWindow.setHandler("cancel", this.onCategoryCancel.bind(this));
        this._categoryWindow.setItemWindow(this._windowSelectRecipes);
        this._categoryWindow.deactivate();
        this.addWindow(this._categoryWindow);
    }

    createGoldWindow() {
        const rect = this.goldWindowRect();
        this._goldWindow = new Window_Gold(rect);
        this.addWindow(this._goldWindow);
    }

    createSelectRecipesWindow() {
        this._windowSelectRecipes = new Window_SelectRecipes(this.selectRecipesWindowRect());
        this._windowSelectRecipes.setHandler("ok", this.selectRecipesOk.bind(this));
        this._windowSelectRecipes.setHandler("select", this.selectRecipesSelect.bind(this));
        this._windowSelectRecipes.setHandler("cancel", this.selectRecipesCancel.bind(this));
        this._windowSelectRecipes.setHelpWindow(this._helpWindow);
        this._windowSelectRecipes.refresh();
        this._windowSelectRecipes.close();
        this._windowSelectRecipes.deactivate();
        this._windowSelectRecipes.hideHelpWindow();
        this._windowSelectRecipes.show();
        this._helpWindow.hide();
        if (this._windowSelectRecipes.maxItems() > 0) this._windowSelectRecipes.select(0);
        this.addWindow(this._windowSelectRecipes);
    }

    createNumberWindow() {
        const rect = this.numberWindowRect();
        this._numberWindow = new Window_AlchemyNumber(rect);
        this._numberWindow.hide();
        this._numberWindow.setHandler("ok", this.onNumberOk.bind(this));
        this._numberWindow.setHandler("changeNumber", this.onNumberChange.bind(this));
        this._numberWindow.setHandler("cancel", this.onNumberCancel.bind(this));
        this.addWindow(this._numberWindow);
    }

    createRecipeDetailWindow() {
        this._windowRecipeDetail = new Window_RecipeDetail(this.recipeDetailWindowRect());
        this._windowRecipeDetail.setNumberWindow(this._numberWindow);
        this._windowRecipeDetail.refresh();
        this._windowRecipeDetail.close();
        this._windowRecipeDetail.deactivate();
        this._windowRecipeDetail.show();
        this.addWindow(this._windowRecipeDetail);
    }

    categoryWindowRect() {
        const goldWindowRect = this.goldWindowRect();
        const wx = 0;
        const wy = this.mainAreaTop();
        const ww = (EnabledGoldWindow ? Graphics.boxWidth - goldWindowRect.width : Graphics.boxWidth);
        const wh = this.calcWindowHeight(1, true);
        return new Rectangle(wx, wy, ww, wh);
    }

    goldWindowRect() {
        const ww = this.mainCommandWidth();
        const wh = this.calcWindowHeight(1, true);
        const wx = Graphics.boxWidth - ww;
        const wy = this.mainAreaTop();
        return new Rectangle(wx, wy, ww, wh);
    }

    numberWindowRect() {
        return this.selectRecipesWindowRect();
    }

    selectRecipesWindowRect() {
        const categoryWindowRect = this.categoryWindowRect();
        const wx = 0;
        const wy = categoryWindowRect.y + categoryWindowRect.height;
        const ww = Math.floor(Graphics.boxWidth / 2);
        const wh = this.mainAreaBottom() - wy;
        return new Rectangle(wx, wy, ww, wh);
    }

    recipeDetailWindowRect() {
        const selectRecipesWindowRect = this.selectRecipesWindowRect();
        const wx = selectRecipesWindowRect.x + selectRecipesWindowRect.width;
        const wy = selectRecipesWindowRect.y;
        const ww = Graphics.boxWidth - wx;
        const wh = selectRecipesWindowRect.height;
        return new Rectangle(wx, wy, ww, wh);
    }

    onCategoryOk() {
        this.changeCategoryWindowToSelectRecipesWindow();
    }

    onCategoryCancel() {
        this.popScene();
    }

    selectRecipesOk() {
        if (this._windowSelectRecipes.maxItems() === 0) return;
        const recipe = this._windowSelectRecipes.recipe();
        this._numberWindow.setup(recipe.targetItemData(), recipe.maxMakeItemCount(), 2);
        this.changeSelectRecipesWindowToNumberWindow();
    }

    selectRecipesCancel() {
        this.changeSelectRecipesWindowToCategoryWindow();
    }

    selectRecipesSelect() {
        if (!this._windowRecipeDetail) return;
        const recipe = this._windowSelectRecipes.recipe();
        this._windowRecipeDetail.setRecipe(recipe);
        this._windowRecipeDetail.refresh();
    }

    onNumberOk() {
        const recipe = this._windowSelectRecipes.recipe();
        recipe.makeItem(this._numberWindow.number());
        if (EnabledGoldWindow) this._goldWindow.refresh();
        this.playMakeItemSe();
        this.changeNumberWindowToSelectRecipesWindow();
    }

    onNumberChange() {
        this._windowRecipeDetail.refresh();
    }

    onNumberCancel() {
        this.changeNumberWindowToSelectRecipesWindow();
    }

    playMakeItemSe() {
        if (MakeItemSeFileName === "") return;
        const se = {
            name: MakeItemSeFileName,
            pan: MakeItemSePan,
            pitch: MakeItemSePitch,
            volume: MakeItemSeVolume,
        }
        AudioManager.playSe(se);
    }

    changeCategoryWindowToSelectRecipesWindow() {
        this._categoryWindow.deactivate();
        this._windowSelectRecipes.refresh();
        this._windowSelectRecipes.activate();
        this._windowSelectRecipes.select(0);
    }

    changeSelectRecipesWindowToMakeItemYesOrNoWindow() {
        this._windowSelectRecipes.deactivate();
        this._windowSelectRecipes.refresh();
        this._windowMakeItemYesOrNo.open();
        this._windowMakeItemYesOrNo.activate();
    }

    changeSelectRecipesWindowToCategoryWindow() {
        this._windowSelectRecipes.deactivate();
        this._windowSelectRecipes.select(-1);
        this._windowSelectRecipes.refresh();
        this._categoryWindow.activate();
    }

    changeSelectRecipesWindowToNumberWindow() {
        this._windowSelectRecipes.deactivate();
        this._windowSelectRecipes.refresh();
        this._numberWindow.show();
        this._numberWindow.activate();
    }

    changeNumberWindowToSelectRecipesWindow() {
        this._numberWindow.hide();
        this._numberWindow.deactivate();
        this._numberWindow._number = 1;
        this._windowRecipeDetail.refresh();
        this._windowSelectRecipes.refresh();
        this._windowSelectRecipes.activate();
    }
}

class Window_SelectRecipes extends Window_Selectable {
    initialize(rect) {
        this._recipes = [];
        this._category = "none";
        super.initialize(rect);
    }

    updateHelp() {
        if (!this.recipe()) return;
        this.setHelpWindowItem(this.recipe().targetItemData());
    }

    // This method is call by Window_AlchemyCategory.
    setCategory(category) {
        if (category !== this._category) {
            this._category = category;
            this.refresh();
        }
    }

    maxCols() {
        return 1;
    }

    maxItems() {
        return this._recipes.length;
    }

    isCurrentItemEnabled() {
        const recipe = this.recipe();
        if (!recipe) return false;
        return recipe.canMakeItem();
    }

    drawItem(index) {
        const recipe = this._recipes[index];
        const rect = this.itemLineRect(index);
        this.changePaintOpacity(recipe.canMakeItem());
        this.drawItemName(recipe.targetItemData(), rect.x, rect.y, rect.width);
        this.changePaintOpacity(true);
    }

    numberWidth() {
        return this.textWidth('000');
    };

    makeItemList() {
        if (!this._category) return;
        this._recipes = $recipes.filter((recipe) => {
            return recipe.targetItemInfo().type === this._category;
        });
    }

    select(index) {
        super.select(index);
        this.callHandler("select");
    }

    selectLast() {
        this.select(this.maxItems() - 1);
    }

    refresh() {
        this.makeItemList();
        this.createContents();
        this.drawAllItems();
    }

    recipe() {
        if (this._recipes.length === 0) return null;
        return this._recipes[this.index()];
    }
}

class Window_AlchemyCategory extends Window_ItemCategory {
    needsCommand(name) {
        if (!DisplayKeyItemCategory && name === "keyItem") return false;
        return super.needsCommand(name);
    }

    maxCols() {
        if (!DisplayKeyItemCategory) return 3;
        return super.maxCols();
    }
}

class Window_AlchemyNumber extends Window_ShopNumber {
    refresh() {
        Window_Selectable.prototype.refresh.call(this);
        this.drawItemBackground(0);
        this.drawCurrentItemName();
        this.drawMultiplicationSign();
        this.drawNumber();
    }

    changeNumber(amount) {
        super.changeNumber(amount);
        this.callHandler("changeNumber");
    }
}

class Window_RecipeDetail extends Window_Base {
    initialize(rect) {
        super.initialize(rect);
        this._numberWindow = null;
    }

    setNumberWindow(numberWindow) {
        this._numberWindow = numberWindow
    }

    setRecipe(recipe) {
        this._recipe = recipe;
    }

    refresh() {
        if (this.contents) {
            this.contents.clear();
            this.draw();
        }
    }

    draw() {
        if (!this._recipe) return;
        this.drawPossession();
        this.drawMaterials();
        if (EnabledGoldWindow) this.drawTotalPrice();
        this.drawTargetItem();
    }

    drawPossession() {
        const x = this.itemPadding();
        const y = this.itemPadding();
        const width = this.innerWidth - this.itemPadding() - x;
        const possessionWidth = this.textWidth("0000");
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(TextManager.possession, x, y, width - possessionWidth);
        this.resetTextColor();
        this.drawText($gameParty.numItems(this._recipe.targetItemData()), x, y, width, "right");
    };

    drawMaterials() {
        const recipe = this._recipe;
        const width = this.width - this.padding * 2 - this.itemPadding() * 2;
        const x = this.itemPadding();
        let y = this.itemPadding() + this.lineHeight();
        this.changeTextColor(this.systemColor());
        this.drawText(NeedMaterialText, x, y, width);
        y += this.lineHeight();
        this.drawHorzLine(y - 5);
        this.resetTextColor();
        for (const tag in recipe.materials()) {
            const material = recipe.materials()[tag];
            const needItemCount = recipe.needItemCount(material.itemInfo) * this._numberWindow.number();
            const hasItemCount = recipe.hasItemCount(material.itemInfo);
            const item = material.itemInfo.itemData();
            this.drawItemName(item, x, y, width - this.numberWidth());
            if (needItemCount <= hasItemCount) {
                this.changeTextColor(ColorManager.crisisColor());
            } else {
                this.changePaintOpacity(false);
            }
            this.drawItemNumber(needItemCount, hasItemCount, x, y, width);
            this.resetTextColor();
            this.changePaintOpacity(true);
            y += this.lineHeight();
        }
    }

    drawTotalPrice() {
        console.log(Object.keys(this._recipe.materials()).length);
        const x = this.itemPadding();
        const minY = this.totalPriceYOfs(MaxMaterials);
        let y = this.totalPriceYOfs(Object.keys(this._recipe.materials()).length);
        if (y < minY) y = minY;
        const currentUnit = TextManager.currencyUnit;
        const width = this.width - this.padding * 2 - this.itemPadding() * 2;
        const goldText = `${this._recipe.price() * this._numberWindow.number()}`;
        this.changeTextColor(this.systemColor());
        this.drawText(NeedPriceText, x, y, width, "left");
        this.resetTextColor();
        this.drawText(goldText, x, y, width - this.textWidth(currentUnit), "right");
        this.changeTextColor(this.systemColor());
        this.drawText(currentUnit, x, y, width, "right");
        this.drawHorzLine(y + this.lineHeight() - 5);
        this.resetTextColor();
    }

    totalPriceYOfs(lines) {
        return this.itemPadding() + lines * this.lineHeight() + this.lineHeight() * 2 + 20;
    }

    drawItemNumber(needItemCount, hasItemCount, x, y, width) {
        this.drawText(`${needItemCount}/${hasItemCount}`, x, y, width, "right");
    }

    numberWidth() {
        return this.textWidth("000/000");
    }

    drawTargetItem() {
        const width = this.width - this.padding * 2;
        const x = this.itemPadding();
        let y;
        y = this.targetItemYOfs(Object.keys(this._recipe.materials()).length);
        const minY = this.targetItemYOfs(MaxMaterials);
        if (y < minY) y = minY;
        const item = this._recipe.targetItemData();
        this.changeTextColor(this.systemColor());
        this.drawText(TargetItemText, x, y, width);
        this.drawHorzLine(y + this.lineHeight() - 5);
        this.resetTextColor();
        this.drawItemName(item, x, y + this.lineHeight(), width);
    }

    targetItemYOfs(lines) {
        if (EnabledGoldWindow) {
            return this.totalPriceYOfs(lines) + this.lineHeight() + 20;
        } else {
            return this.totalPriceYOfs(lines);
        }
    }

    drawHorzLine(y) {
        const padding = this.itemPadding();
        const x = padding;
        const width = this.innerWidth - padding * 2;
        this.drawRect(x, y, width, 5);
    }
}

// Add alchemy to menu command.
const _Window_MenuCommand_addOriginalCommands = Window_MenuCommand.prototype.addOriginalCommands;
Window_MenuCommand.prototype.addOriginalCommands = function() {
    _Window_MenuCommand_addOriginalCommands.call(this);
    if (EnabledMenuAlchemy) this.addCommand(MenuAlchemyText, "alchemy", this.isEnabledAlchemy());
};

Window_MenuCommand.prototype.isEnabledAlchemy = function() {
    if (EnabledAlchemySwitchId === 0) return true;
    return $gameSwitches.value(EnabledAlchemySwitchId);
};

const _Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
Scene_Menu.prototype.createCommandWindow = function() {
    _Scene_Menu_createCommandWindow.call(this);
    if (EnabledMenuAlchemy) this._commandWindow.setHandler("alchemy", this.alchemy.bind(this));
};

Scene_Menu.prototype.alchemy = function() {
    SceneManager.push(Scene_Alchemy);
};

// Register plugin command.
PluginManager.registerCommand(pluginName, "StartAlchemyScene", () => {
    SceneManager.push(Scene_Alchemy);
});

// Define class alias.
AlchemyClassAlias.ItemInfo = ItemInfo;
AlchemyClassAlias.Material = Material;
AlchemyClassAlias.AlchemyRecipe = AlchemyRecipe;
AlchemyClassAlias.Scene_Alchemy = Scene_Alchemy;
AlchemyClassAlias.Window_SelectRecipes = Window_SelectRecipes;
AlchemyClassAlias.Window_AlchemyCategory = Window_AlchemyCategory;
AlchemyClassAlias.Window_AlchemyNumber = Window_AlchemyNumber;
AlchemyClassAlias.Window_RecipeDetail = Window_RecipeDetail;
})();
