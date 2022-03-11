//=============================================================================
// RPG Maker MZ - Text Script Base Plugin
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Text Script Base Plugin
 * @author triacontane
 * @base PluginCommonBase
 * @beforeThan PluginCommonBase
 *
 * @param TextList
 * @text Text Base List
 * @desc List of registered text and scripts.
 * @default []
 * @type struct<TextItem>[]
 *
 * @command CHANGE_TEXT
 * @text Change Text
 * @desc Replaces text with the specified identifier with other text. The change state is saved in a save file.
 *
 * @arg Id
 * @text Identifier
 * @desc An identifier that uniquely designates text.
 *
 * @arg Text
 * @text Text
 * @desc The text after change.
 * @default
 * @type multiline_string
 *
 * @help TextScriptBase.js
 *
 * This is a database that can register and manage multi-line strings such as text and scripts.
 * Registered text can be referenced with the following control codes.
 * \tx[aaa] //  Swaps in the text registered with identifier [aaa].
 * \js[bbb] //  Evaluates the text registered with identifier [bbb] as a script on the spot
 *             and is swapped out for the results.
 *
 * When executing scripts, the plugin can pass arguments.
 * Arguments are automatically type converted, and can be referenced from the "args" array.
 * \js[bbb,10,ccc] // Array [10, 'ccc'] is stored in variable args.
 *
 * Scripts can also be directly entered and embedded.
 * \js<xxx> // Is replaced by the execution results of script xxx.
 *
 * However, you will need to escape as shown below when symbols "<" or ">"
 * are used in scripting.
 * > : &gt;
 * < : &lt;
 *
 * The situations where control characters can be used are as follows.
 * -Text display
 * -Notes field (*)
 * -Plugin command (*)
 * -Plugin parameter (*)
 * -Explanation fields for skills, etc.
 * *Only for plugins that take PluginCommonBase.js as a base.
 *
 * This plugin allows you to easily register and call frequently used scripts and text,
 * and configure long strings even when the database input field is restricted.
 */

/*~struct~TextItem:
 *
 * @param Id
 * @text Identifier
 * @desc An identifier that uniquely designates text. If omitted, the INDEX will become the identifier.
 *
 * @param Text
 * @text Text
 * @desc The actual string to be swapped.
 * @default
 * @type multiline_string
 */

 /*:ja
 * @target MZ
 * @plugindesc テキストやスクリプトをデータベースとして登録、参照できます。
 * @author トリアコンタン
 * @base PluginCommonBase
 * @beforeThan PluginCommonBase
 *
 * @param TextList
 * @text テキストベースリスト
 * @desc 登録するテキストやスクリプトのリストです。
 * @default []
 * @type struct<TextItem>[]
 *
 * @command CHANGE_TEXT
 * @text テキスト変更
 * @desc 指定した識別子のテキストを別のテキストに置き換えます。変更状態はセーブファイルに保存されます。
 *
 * @arg Id
 * @text 識別子
 * @desc テキストを一意に特定するための識別子です。
 *
 * @arg Text
 * @text テキスト
 * @desc 変更後のテキストです。
 * @default
 * @type multiline_string
 *
 * @help TextScriptBase.js
 *
 * テキストやスクリプトなどの複数行の文字列を登録、管理できるデータベースです。
 * 登録したテキストは以下の制御文字で参照できます。
 * \tx[aaa] // 識別子[aaa]で登録したテキストに置き換わります。
 * \js[bbb] // 識別子[bbb]で登録したテキストをその場でスクリプトとして評価して
 *             結果に置き換わります。
 *
 * スクリプトを実行する場合、引数を渡すことができます。
 * 引数は自働で型変換され、配列「args」から参照できます。
 * \js[bbb,10,ccc] // 配列[10, 'ccc']が変数argsに格納されます。
 *
 * スクリプトを直接記述して埋め込むこともできます。
 * \js<xxx> // スクリプトxxxの実行結果に置き換わります。
 *
 * ただし、スクリプト中で記号「<」「>」を使う場合は以下の通り
 * エスケープする必要があります。
 * > : &gt;
 * < : &lt;
 *
 * 制御文字を利用可能な場面は以下の通りです。
 * ・文章の表示
 * ・メモ欄(※)
 * ・プラグインコマンド(※)
 * ・プラグインパラメータ(※)
 * ・スキルなどの説明欄
 * ※ PluginCommonBase.jsをベースとして取り込んだプラグインのみ
 *
 * 本プラグインの利用により、よく使うスクリプトやテキストを登録して簡単に呼び出したり
 * データベースの入力欄が限られている場合でも長い文字列を設定できます。
 *
 */
/*~struct~TextItem:ja
 *
 * @param Id
 * @text 識別子
 * @desc テキストを一意に特定するための識別子です。省略した場合はINDEXが識別子になります。
 *
 * @param Text
 * @text テキスト
 * @desc 実際に置き換えられる文字列です。
 * @default
 * @type multiline_string
 */

(() => {
    'use strict';
    const script = document.currentScript;
    const param  = PluginManagerEx.createParameter(script);

    PluginManagerEx.registerCommand(script, 'CHANGE_TEXT', args => {
        $gameSystem.setTextBase(args.Id, args.Text);
    });

    const _PluginManagerEx_convertEscapeCharactersEx = PluginManagerEx.convertEscapeCharactersEx;
    PluginManagerEx.convertEscapeCharactersEx        = function(text) {
        text = _PluginManagerEx_convertEscapeCharactersEx.apply(this, arguments);
        text = text.replace(/\x1bTX\[(.+?)]/gi, (_, p1) =>
            $gameSystem ? $gameSystem.getTextBase(p1) : findTextParam(param.TextList, p1)
        );
        text = text.replace(/\x1bJS\[(.+?)]/gi, (_, p1) => {
            const args = p1.split(',').map(arg => this.convertVariables(arg));
            const id   = args.shift();
            const item = $gameSystem ? $gameSystem.getTextBase(id) : findTextParam(param.TextList, id);
            const scriptText = this.convertVariables(item);
            try {
                return eval(scriptText);
            } catch (e) {
                PluginManagerEx.throwError(`Script Error:${scriptText}`, script);
            }
        });
        text = text.replace(/\x1bJS<(.+?)>/gi, (_, p1) => eval(this.escapeXmlTag(p1)));
        return text;
    };

    Game_System.prototype.setTextBase = function(id, text) {
        if (!this._textBase) {
            this._textBase = {};
        }
        this._textBase[id || fileName] = text;
    };

    Game_System.prototype.getTextBase = function(id) {
        if (!this._textBase) {
            this._textBase = {};
        }
        return this._textBase[id] || findTextParam(param.TextList, id);
    };

    const findTextParam = (list, id) => {
        let item = list.filter(item => item.Id === id)[0];
        if (!item) {
            item = list[parseInt(id) - 1];
        }
        if (!item) {
            PluginManagerEx.throwError(`Text [${id}] is not found.`, script);
        }
        return item ? item.Text : '';
    };
})();
