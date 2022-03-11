//=============================================================================
// MOG_Weather_EX.js
//=============================================================================

/*:
 * @plugindesc v3.40 天气粒子效果(需要素材)(已修改) 作者:Moghunter
 * @author Moghunter
 *
 * @param Battle Weather
 * @text 应用于战斗界面
 * @type boolean
 * @default false
 *
 * @param 图片文件-1
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-2
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-3
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-4
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-5
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-6
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-7
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-8
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-9
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-10
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-11
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-12
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-13
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-14
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-15
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-16
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-17
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-18
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-19
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-20
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-21
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-22
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-23
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-24
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-25
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-26
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-27
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-28
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-29
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-30
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-31
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-32
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-33
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-34
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-35
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-36
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-37
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-38
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-39
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-40
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-41
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-42
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-43
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-44
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-45
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-46
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-47
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-48
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-49
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-50
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-51
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-52
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-53
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-54
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-55
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-56
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-57
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-58
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-59
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-60
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-61
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-62
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-63
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-64
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-65
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-66
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-67
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-68
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-69
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-70
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-71
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-72
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-73
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-74
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-75
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-76
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-77
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-78
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-79
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-80
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-81
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-82
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-83
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-84
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-85
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-86
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-87
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-88
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-89
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-90
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-91
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-92
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-93
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-94
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-95
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-96
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-97
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-98
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-99
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-100
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-101
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-102
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-103
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-104
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-105
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-106
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-107
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-108
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-109
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-110
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-111
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-112
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-113
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-114
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-115
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-116
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-117
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-118
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-119
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-120
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-121
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-122
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-123
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-124
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-125
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-126
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-127
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-128
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-129
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-130
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-131
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-132
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-133
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-134
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-135
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-136
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-137
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-138
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-139
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-140
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-141
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-142
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-143
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-144
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-145
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-146
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-147
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-148
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-149
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-150
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-151
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-152
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-153
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-154
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-155
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-156
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-157
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-158
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-159
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-160
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-161
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-162
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-163
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-164
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-165
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-166
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-167
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-168
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-169
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-170
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-171
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-172
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-173
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-174
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-175
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-176
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-177
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-178
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-179
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-180
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-181
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-182
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-183
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-184
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-185
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-186
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-187
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-188
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-189
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-190
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-191
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-192
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-193
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-194
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-195
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-196
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-197
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-198
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-199
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @param 图片文件-200
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
 *
 * @help
 * >>>重点:
 * 〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓
 * 插件已修改
 * 〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓
 *
 *
 * >>>素材路径:
 * 〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓
 * img/Ex_map_layer
 * 〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓
 *
 *
 * >>>注意:
 * 〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓
 * 1:不能应用于战斗界面,因为与YEP_ImprovedBattlebacks不兼容
 * 2:地图的大小最少27X15,不然屏幕左侧和上半部分会缺失粒子
 * 〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓
 *
 *
 * >>>说明:
 * 〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓
 * 天气粒子效果可以设置多层
 * 〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓
 *
 *
 * >>>插件命令:
 * 〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓
 * 激活天气粒子:
 * weather : A : B : C : D : E : F
 * weather : A : B : C : D : E : F : G : H : I : J
 *
 * A - ID:天气粒子的编号,重复的ID设置会被覆盖
 * ╭──────── B - 流动方式: ────────╮
 * 0-清风(落叶)  1-清风(左侧吹动)  2-狂风(迎面刮来)
 * 3-上浮(螺旋)  4-上浮(能量域)  5-悬浮(幽灵)
 * 6-火焰(上下光斑)  7-火焰(下光斑)  8-火焰(轰炸)
 * 9-小雪  10-暴雪  11-落霜  12-雨(小水珠)
 * 13-雨(大水珠)  14-狂雨  15-雾(右侧漂浮)  16-雾(向下漂浮)
 * 17-风中雾(右侧漂浮)  18-交叉车道  19-迎面火花
 * 20-天体旋转  21-阳光隐现  22-水平雾  23-上浮(蒸汽)
 * 24-横穿梭光线  25-星落(单向)  26-星落(旋转)
 * 27-闪烁星点  28-落石  29-火焰(火苗漂浮)  30-水中气泡
 * 31-镜头污渍  32-横向远景  33-纵向远景  34-固定横向远景
 * ╰──────── B - 流动方式: ────────╯
 * C - 飘浮强度:60为标准强度,范围:1~2000(强度和粒子数量成正比)
 * D - 飘浮速度:100为标准速度,范围:0~1000(0%-1000%)
 * E - 混合模式:0-普通,1-叠加,2-正片叠底
 * F - 文件名:素材的文件名,不需要文件后缀
 * G - 层级(默认1)
 *      ↳0:在图块下面
 *      ↳1:在图块上面,图片下面
 *      ↳2:在图片上面
 * H - 缩放大小(默认:100)范围:0-800(0%-800%)
 * I - 帧数
 * J - 播放间隔帧
 * ============================================================================
 * clear_weather : ID       清除单个天气粒子
 * clear_all_weathers       清除所有天气粒子
 * ============================================================================
 * battle_weather : true    启用天气粒子
 * battle_weather : false   禁用天气粒子
 * 〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓
 *
 * >>>示例:
 * 〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓
 * 光点下落:
 * weather : 0 : 9 : 60 : 100 : 0 : WE_Light_01
 * ============================================================================
 * 光团乱飞:
 * weather : 0 : 19 : 60 : 100 : 1 : WE_Light_04
 * ============================================================================
 * 光团上升1:
 * weather : 0 : 3 : 40 : 100 : 1 : WE_Light_02
 * weather : 1 : 3 : 50 : 50 : 0 : WE_Rain_01 : 1 : 30
 * ============================================================================
 * 光团上升2:
 * weather : 0 : 4 : 40 : 100 : 1 : WE_Light_01
 * weather : 1 : 4 : 30 : 50 : 0 : WE_Rain_02 : 1 : 30
 * ============================================================================
 * 光团碰撞:
 * weather : 0 : 5 : 60 : 100 : 1 : WE_Light_01
 * weather : 1 : 5 : 30 : 100 : 0 : WE_Light_02 : 1 : 30
 * ============================================================================
 * 红光穿插:
 * weather : 0 : 20 : 50 : 100 : 0 : WE_Light_03
 * ============================================================================
 * 激光横穿:
 * weather : 0 : 24 : 60 : 100 : 1 : WE_SunLight_06
 * ============================================================================
 * 星星闪耀:
 * weather : 0 : 27 : 40 : 100 : 1 : WE_Light_04 : 1
 * ============================================================================
 * 光线:
 * weather : 0 : 21 : 15 : 100 : 1 : WE_SunLight_02
 * ============================================================================
 * 流星:
 * weather : 0 : 25 : 60 : 100 : 1 : WE_Star_03 : 0
 * ============================================================================
 * 星星斜下落:
 * weather : 0 : 26 : 60 : 100 : 0 : WE_Star_01 : 0
 * ============================================================================
 * 萤火虫:
 * weather : 0 : 29 : 20 : 50 : 1 : WE_Light_01 : 1
 * weather : 1 : 29 : 20 : 20 : 1 : WE_Light_02 : 1
 * ============================================================================
 * 大叶子飘过:
 * weather : 0 : 0 : 30 : 100 : 0 : WE_Leaf_09 : 1
 * ============================================================================
 * 大叶子停顿:
 * weather : 0 : 31 : 90 : 100 : 2 : WE_Leaf_08
 * ============================================================================
 * 落叶纷飞:
 * weather : 0 : 0 : 40 : 100 : 0 : WE_Leaf_03
 * weather : 1 : 1 : 40 : 100 : 0 : WE_Leaf_05
 * ============================================================================
 * 枫叶飘落:
 * weather : 0 : 0 : 40 : 100 : 0 : WE_Leaf_05
 * ============================================================================
 * 风卷树叶:
 * weather : 0 : 2 : 40 : 100 : 0 : WE_Leaf_04
 * ============================================================================
 * 四处着火:
 * weather : 0 : 23 : 20 : 200 : 1 : WE_Fire_03
 * ============================================================================
 * 上下火光:
 * weather : 0 : 6 : 80 : 100 : 1 : WE_Light_03
 * weather : 1 : 3 : 40 : 50 : 1 : WE_Rain_01 : 1 : 30
 * ============================================================================
 * 爆炸:
 * weather : 0 : 8 : 20 : 100 : 1 : WE_Light_03
 * weather : 1 : 3 : 80 : 50 : 1 : WE_Rain_02 : 1 : 30
 * weather : 2 : 1 : 30 : 100 : 1 : WE_Light_03 : 1 : 30
 * ============================================================================
 * 远景云,持续上升:
 * weather : 0 : 16 : 30 : 100 : 0 : WE_Cloud_01 : 0
 * weather : 1 : 16 : 30 : 100 : 0 : WE_Cloud_03 : 0
 * ============================================================================
 * 云朵漂浮:
 * weather : 0 : 15 : 30 : 100 : 0 : WE_Cloud_01
 * weather : 1 : 22 : 40 : 100 : 1 : WE_Cloud_06
 * ============================================================================
 * 下雨:
 * weather : 0 : 12 : 80 : 100 : 0 : WE_Rain_01
 * weather : 1 : 13 : 50 : 100 : 0 : WE_Rain_01
 * ============================================================================
 * 下血雨:
 * weather : 0 : 13 : 60 : 100 : 0 : WE_Rain_02
 * ============================================================================
 * 下雪:
 * weather : 0 : 10 : 60 : 40 : 0 : WE_Snow_01 : 1 : 50
 * weather : 1 : 10 : 100 : 30 : 0 : WE_Snow_04 : 1 : 50
 * ============================================================================
 * 下冰雹:
 * weather : 0 : 28 : 40 : 100 : 0 : WE_Snow_02 : 1
 * weather : 1 : 12 : 40 : 30 : 0 : WE_Snow_02 : 1 : 50
 * ============================================================================
 * 泡泡上升:
 * weather : 0 : 30 : 30 : 100 : 0 : WE_Bubble_01
 * weather : 1 : 3 : 50 : 50 : 0 : WE_Bubble_01 : 1 : 40
 * ============================================================================
 * 随机骰子:
 * weather : 0 : 28 : 10 : 100 : 0 : WE_Frames_01 : 1 : 200 : 4 : 10
 * ============================================================================
 */

//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
/*〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓
描述:优化素材文件夹,将保存在weather文件夹的素材转移到Ex_map_layer
==========================================================================================================
  ImageManager.loadWeather = function(filename) {
  	return this.loadBitmap('img/weather/', filename, 0, true);
  };
修改为:
  ImageManager.loadWeather = function(filename) {
    return this.loadBitmap('img/Ex_map_layer/', filename, 0, true);
  };
〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓
描述:添加了插件参数关联素材
==========================================================================================================
添加插件参数:
 * @param 图片文件-1
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file

...

 * @param 图片文件-200
 * @require 1
 * @dir img/Ex_map_layer/
 * @type file
〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓*/
//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

//=============================================================================
// ** PLUGIN PARAMETERS
//=============================================================================

  var Imported = Imported || {};　　
  Imported.MOG_Weather_EX = true;　　
  var Moghunter = Moghunter || {};

  　
  Moghunter.parameters = PluginManager.parameters('MOG_Weather_EX');
  Moghunter.weatherEX_max = Number(Moghunter.parameters['Weather Max'] || 20);
  Moghunter.weatherEX_battle = String(Moghunter.parameters['Battle Weather'] || "true");
  Moghunter.weatherEX_layer1 = Number(Moghunter.parameters['Layer 1 - Z-Index'] || 0);
  Moghunter.weatherEX_layer2 = Number(Moghunter.parameters['Layer 2 - Z-Index'] || 50);
  Moghunter.weatherEX_layer3 = Number(Moghunter.parameters['Layer 3 - Z-Index'] || 110);


  //=============================================================================
  // ** ImageManager
  //=============================================================================

  //==============================
  // * Weather
  //==============================
  ImageManager.loadWeather = function(filename) {
  	return this.loadBitmap('img/Ex_map_layer/', filename, 0, true);
  };

  //=============================================================================
  // ** Game System
  //=============================================================================

  //==============================
  // * Initialize
  //==============================
  var _mog_weatherEX_system_initialize = Game_System.prototype.initialize;
  Game_System.prototype.initialize = function() {
  	_mog_weatherEX_system_initialize.call(this);
  	this._weatherEXScnBat = String(Moghunter.weatherEX_battle) === "true" ? true : false;
  	this._weatherEX_MapId = -1;
  	this.weatherEX_initialize(false);
  };

  //==============================
  // * weather EX initialize
  //==============================
  Game_System.prototype.weatherEX_initialize = function(needrefresh) {
  	this._weatherSprites = null;
  	this._weatherPreData = null;
  	if (this._weatherEX_Data == null) {
  		this._weatherEX_Data = []
  	};
  	for (var i = 0; i < Moghunter.weatherEX_max; i++) {
  		this.clearWeatherEX(i, needrefresh);
  	};
  };

  //==============================
  // * clear Weather EX
  //==============================
  Game_System.prototype.clearWeatherEX = function(id, needrefresh) {
  	this._needRefreshWeatherEX = needrefresh;
  	this._weatherEX_Data[id] = {};
  	this._weatherEX_Data[id].mode = -1;
  	this._weatherEX_Data[id].power = 0;
  	this._weatherEX_Data[id].fileName = "";
  	this._weatherEX_Data[id].z = 0;
  	this._weatherEX_Data[id].blendMode = 0;
  	this._weatherEX_Data[id].speed = 0;
  	this._weatherEX_Data[id].rot = 0;
  	this._weatherEX_Data[id].scale = 0;
  	this._weatherEX_Data[id].frames = 1
  	this._weatherEX_Data[id].needRefresh = needrefresh;
  };

  //==============================
  // * Command Setup Weather
  //==============================
  Game_System.prototype.commandSetupWeather = function(args) {
  	var id = args[1] != null ? Number(args[1]) : 0;
  	var mode = args[3] != null ? Number(args[3]) : 0;
  	var power = args[5] != null ? Number(args[5]) : 1;
  	var speed = args[7] != null ? Number(args[7]) : 100;
  	var blendType = args[9] != null ? Number(args[9]) : 0;
  	var fileName = args[11] != null ? String(args[11]) : "";
  	var z = args[13] != null ? Number(args[13]) : 1;
  	var scale = args[15] != null ? Number(args[15]) : 100;
  	var frame = args[17] != null ? Number(args[17]) : 1;
  	var frameSpeed = args[19] != null ? Number(args[19]) : 10;

  	var id_Real = Math.min(Math.max(id, 0), $gameSystem._weatherEX_Data.length - 1);
  	var mode_Real = Math.min(Math.max(mode, 0), 35);
  	var power_Real = Math.max(power, 1);
  	var z_Real = Math.min(Math.max(z, 0), 2);
  	var blendType_Real = Math.min(Math.max(blendType, 0), 2);
  	var scale_Real = Math.min(Math.max(scale, 0), 800);
  	var speed_Real = Math.min(Math.max(speed, 0), 1000);
  	var frame_Real = Math.min(Math.max(frame, 1), 100);
  	var frame_Speed = Math.min(Math.max(frameSpeed, 0), 1000);

  	this._weatherEX_Data[id_Real].mode = mode_Real;
  	this._weatherEX_Data[id_Real].power = power_Real;
  	this._weatherEX_Data[id_Real].z = z_Real;
  	this._weatherEX_Data[id_Real].blendMode = blendType_Real;
  	this._weatherEX_Data[id_Real].fileName = fileName;
  	this._weatherEX_Data[id_Real].speed = speed_Real;
  	this._weatherEX_Data[id_Real].scale = scale_Real;
  	this._weatherEX_Data[id_Real].frames = frame_Real;
  	this._weatherEX_Data[id_Real].frameSpeed = frame_Speed;
  	this._weatherEX_Data[id_Real].needRefresh = true;
  	this._needRefreshWeatherEX = true;
  };

  //==============================
  // * weather Mode
  //==============================
  Game_System.prototype.weatherMode = function(id) {
  	if (id == null) {
  		return 0
  	};
  	if (this._weatherEX_Data[id] == null) {
  		return 0
  	};
  	return this._weatherEX_Data[id].mode;
  };

  //=============================================================================
  // ** Game_Interpreter
  //=============================================================================

  //==============================
  // * Plugin Command
  //==============================
  var _mog_weatherEX_pluginCommand = Game_Interpreter.prototype.pluginCommand
  Game_Interpreter.prototype.pluginCommand = function(command, args) {
  	this.commandWeatherEX(command, args);
  	_mog_weatherEX_pluginCommand.call(this, command, args);
  	return true;
  };

  //==============================
  // * Command Weather EX
  //==============================
  Game_Interpreter.prototype.commandWeatherEX = function(command, args) {
  	if (command === "clear_weather") {
  		$gameSystem.clearWeatherEX(Number(args[1]), true)
  	};
  	if (command === "clear_all_weathers") {
  		$gameSystem.weatherEX_initialize(true)
  	};
  	if (command === "battle_weather") {
  		this.commandBattleWeather(args)
  	};
  	if (command === "weather" && args) {
  		$gameSystem.commandSetupWeather(args)
  	};
  	return true;
  };

  //==============================
  // * Command Battle Weather
  //==============================
  Game_Interpreter.prototype.commandBattleWeather = function(args) {
  	var enable = args[1] != null ? String(args[1]) : true;
  	var enableReal = String(enable) === "true" ? true : false;
  	$gameSystem._weatherEXScnBat = enableReal;
  };

  //=============================================================================
  // ** Game Map
  //=============================================================================

  //==============================
  // * Setup
  //==============================
  var _mog_weatherEX_gmap_setup = Game_Map.prototype.setup;
  Game_Map.prototype.setup = function(mapId) {
  	_mog_weatherEX_gmap_setup.call(this, mapId);
  	if (this._mapId > 0) {
  		this.setWeatherEX($dataMap.note)
  	};
  };

  //==============================
  // * Setup Weather EX
  //==============================
  Game_Map.prototype.setWeatherEX = function(nt) {
  	var notetags = nt.split(/[\r\n]+/);
  	notetags.forEach(function(note) {
  		var note_data = note.split(' : ')
  		if (notetags == "clear_all_weathers") {
  			$gameSystem.weatherEX_initialize(true)
  		} else if (note_data[0].toLowerCase() == "weather") {
  			note_data.shift();
  			var noteR = [];
  			var rd = 0;
  			var rdi = 0;
  			var maxr = note_data.length * 2
  			for (var i = 0; i < maxr; i++) {
  				if (rd == 0) {
  					noteR.push([]);
  					rd = 1;
  				} else {
  					noteR.push(note_data[rdi]);
  					rd = 0;
  					rdi++
  				};
  			};
  			$gameSystem.commandSetupWeather(noteR);
  		}
  	}, this);
  };

  //=============================================================================
  // ** Spriteset Base
  //=============================================================================

  //==============================
  // * initialize
  //==============================
  var _mog_weatherEx_sprtBase = Spriteset_Base.prototype.initialize;
  Spriteset_Base.prototype.initialize = function() {
  	this._weatherEXSprites = [];
  	_mog_weatherEx_sprtBase.call(this);
  	$gameSystem._weatherSprites = null;
  	$gameSystem._weatherPreData = null
  };

  //==============================
  // * record Weather EX DataMap
  //==============================
  Spriteset_Base.prototype.recordWeatherEXDataMap = function() {
  	for (var i = 0; i < this._weatherEXSprites.length; i++) {
  		if (this._weatherEXSprites[i]) {
  			this._weatherEXSprites[i].recordWeatherEXData();
  		};
  	};
  };

  //==============================
  // * load Pre Weather
  //==============================
  Spriteset_Base.prototype.reloadWeatherEX = function() {
  	for (var i = 0; i < $gameSystem._weatherEX_Data.length; i++) {
  		if ($gameSystem._weatherEX_Data[i]) {
  			if ($gameSystem._weatherEX_Data[i].mode >= 0) {
  				this.createWeatherEX(i);
  			};
  			$gameSystem._weatherEX_Data[i].needRefresh = false;
  		};
  	};
  };

  //==============================
  // * create Weather EX
  //==============================
  Spriteset_Base.prototype.createWeatherEX = function(id) {
  	this._weatherEXSprites[id] = new SpriteWeatherEX(id);
  	this._weatherEXSprites[id].z = id + 10;
  	if ($gameSystem._weatherEX_Data[id].z === 0) {
  		this._weatherField_1.addChild(this._weatherEXSprites[id]);
  	} else if ($gameSystem._weatherEX_Data[id].z === 1) {
  		this._weatherField_2.addChild(this._weatherEXSprites[id]);
  	} else {
  		this._weatherField_3.addChild(this._weatherEXSprites[id]);
  	};
  	this._weatherField_1.children.sort(function(a, b) {
  		return a.z - b.z
  	});
  	this._weatherField_2.children.sort(function(a, b) {
  		return a.z - b.z
  	});
  	this._weatherField_3.children.sort(function(a, b) {
  		return a.z - b.z
  	});

  };

  //==============================
  // * create Weather EX Refresh
  //==============================
  Spriteset_Base.prototype.createWeatherEXRefresh = function() {
  	for (var i = 0; i < $gameSystem._weatherEX_Data.length; i++) {
  		if ($gameSystem._weatherEX_Data[i]) {
  			if (this.canCreateWeatherEX(i)) {
  				this.createWeatherEX(i);
  			};
  			$gameSystem._weatherEX_Data[i].needRefresh = false;
  		};
  	};
  };

  //==============================
  // * can Create Weather EX
  //==============================
  Spriteset_Base.prototype.canCreateWeatherEX = function(i) {
  	if ($gameSystem._weatherEX_Data[i].mode < 0) {
  		return false
  	};
  	if ($gameParty.inBattle()) {
  		return true
  	};
  	if (!$gameSystem._weatherEX_Data[i].needRefresh) {
  		return false
  	};
  	return true;
  };


  //==============================
  // * remove Weather EX Refresh
  //==============================
  Spriteset_Base.prototype.removeWeatherEXRefresh = function() {
  	for (var i = 0; i < $gameSystem._weatherEX_Data.length; i++) {
  		if ($gameSystem._weatherEX_Data[i].needRefresh && this._weatherEXSprites[i]) {
  			this._weatherField_1.removeChild(this._weatherEXSprites[i]);
  			this._weatherField_2.removeChild(this._weatherEXSprites[i]);
  			this._weatherEXSprites[i].clear();
  			this._weatherEXSprites[i] = null;
  		};
  	};
  };

  //==============================
  // * create Weather Field 1
  //==============================
  Spriteset_Base.prototype.createWeatherField_1 = function(mode) {
  	this._weatherField_1 = new Sprite();
  	this._weatherField_1.z = Moghunter.weatherEX_layer1;
  	this._weatherField_1.mz = this._weatherField_1.z;
  	if (mode === 1 && this._battleField) {
  		this._battleField.addChild(this._weatherField_1);
  	} else {
  		this._baseSprite.addChild(this._weatherField_1);
  	};
  };

  //==============================
  // * create Weather Field 2
  //==============================
  Spriteset_Base.prototype.createWeatherField_2 = function(mode) {
  	this._weatherField_2 = new Sprite();
  	this._weatherField_2.z = Moghunter.weatherEX_layer2;
  	this._weatherField_2.mz = this._weatherField_2.z;
  	if (mode === 1 && this._battleField) {
  		this._battleField.addChild(this._weatherField_2);
  	} else {
  		this._baseSprite.addChild(this._weatherField_2);
  	};
  };

  //==============================
  // * create Weather Field 3
  //==============================
  Spriteset_Base.prototype.createWeatherField_3 = function(mode) {
  	this._weatherField_3 = new Sprite();
  	this._weatherField_3.z = Moghunter.weatherEX_layer3;
  	this._weatherField_3.mz = this._weatherField_3.z;
  	this._pictureContainer.addChild(this._weatherField_3);
  };

  //==============================
  // * Create Pictures
  //==============================
  var _mog_weatherEX_sprtbase_createPictures = Spriteset_Base.prototype.createPictures;
  Spriteset_Base.prototype.createPictures = function() {
  	_mog_weatherEX_sprtbase_createPictures.call(this);
  	this.createWeatherField_3();
  	if (this.canReloadWeatherEX()) {
  		this.reloadWeatherEX();
  	};
  };

  //==============================
  // * Can Reload Weather EX
  //==============================
  Spriteset_Base.prototype.canReloadWeatherEX = function() {
  	if (this._battleField && !$gameSystem._weatherEXScnBat) {
  		return false
  	};
  	return true;
  };

  //==============================
  // * Update
  //==============================
  var _mog_weatherEX_sprtbase_update = Spriteset_Base.prototype.update;
  Spriteset_Base.prototype.update = function() {
  	_mog_weatherEX_sprtbase_update.call(this);
  	this.updateWeatherEX_Base();
  	$gameSystem._weatherEX_MapId = $gameMap._mapId;
  };

  //==============================
  // * Update Weather EX Base
  //==============================
  Spriteset_Base.prototype.updateWeatherEX_Base = function(id) {
  	if ($gameSystem._needRefreshWeatherEX) {
  		this.refreshWeatherEX()
  	};
  };

  //==============================
  // * Refresh Weather EX
  //==============================
  Spriteset_Base.prototype.refreshWeatherEX = function() {
  	$gameSystem._needRefreshWeatherEX = false;
  	this.removeWeatherEXRefresh()
  	this.createWeatherEXRefresh()
  };

  //=============================================================================
  // ** Spriteset Map
  //=============================================================================

  //==============================
  // * create Parallax
  //==============================
  var _mog_weatherEx_sprtMap_createParallax = Spriteset_Map.prototype.createParallax;
  Spriteset_Map.prototype.createParallax = function() {
  	_mog_weatherEx_sprtMap_createParallax.call(this);
  	if (!this._weatherField_1) {
  		this.createWeatherField_1(0)
  	};
  };

  //==============================
  // * create TileMap
  //==============================
  var _mog_weatherEx_sprtMap_createTilemap = Spriteset_Map.prototype.createTilemap;
  Spriteset_Map.prototype.createTilemap = function() {
  	if (!this._weatherField_1) {
  		this.createWeatherField_1(0)
  	};
  	_mog_weatherEx_sprtMap_createTilemap.call(this);
  };

  //==============================
  // * create Lower Layer
  //==============================
  var _mog_weatherEx_sprtMap_createLowerLayer = Spriteset_Map.prototype.createLowerLayer;
  Spriteset_Map.prototype.createLowerLayer = function() {
  	_mog_weatherEx_sprtMap_createLowerLayer.call(this);
  	if (!this._weatherField_2) {
  		this.createWeatherField_2(0)
  	};
  };

  //=============================================================================
  // ** Spriteset Battle
  //=============================================================================

  //==============================
  // * create BattleBack
  //==============================
  var _mog_weatherEx_createBattleback = Spriteset_Battle.prototype.createBattleback;
  Spriteset_Battle.prototype.createBattleback = function() {
  	if (!this._weatherField_1) {
  		this.createWeatherField_1(1)
  	};
  	_mog_weatherEx_createBattleback.call(this);
  };

  //==============================
  // * create Lower Layer
  //==============================
  var _mog_weatherEx_sprtBat_createLowerLayer = Spriteset_Battle.prototype.createLowerLayer;
  Spriteset_Battle.prototype.createLowerLayer = function() {
  	_mog_weatherEx_sprtBat_createLowerLayer.call(this);
  	if (!this._weatherField_2) {
  		this.createWeatherField_2(1)
  	};
  };

  //=============================================================================
  // ** Scene Map
  //=============================================================================

  //==============================
  // * snap For BattleBackground
  //==============================
  var _weather_ex_scMap_snapForBattleBackground = Scene_Map.prototype.snapForBattleBackground;
  Scene_Map.prototype.snapForBattleBackground = function() {
  	if (this.needHideWeatherforSnap(0)) {
  		this.enableWeatherEXField(false)
  	};
  	_weather_ex_scMap_snapForBattleBackground.call(this);
  	if (this.needHideWeatherforSnap(1)) {
  		this.enableWeatherEXField(true)
  	};
  };

  //==============================
  // * need Hide Weather for Snap
  //==============================
  Scene_Map.prototype.needHideWeatherforSnap = function(mode) {
  	if (!this._spriteset) {
  		return false
  	};
  	if (!this._spriteset._weatherField_1) {
  		return false
  	};
  	if (mode == 1) {
  		return true
  	};
  	if (!$gameSystem._weatherEXScnBat) {
  		return false
  	};
  	return true;
  };

  //==============================
  // * enable Weather EX Field
  //==============================
  Scene_Map.prototype.enableWeatherEXField = function(enable) {
  	this._spriteset._weatherField_1.visible = enable;
  	this._spriteset._weatherField_2.visible = enable;
  	this._spriteset._weatherField_3.visible = enable;
  };

  //==============================
  // * Terminate
  //==============================
  var _mog_weatherEX_scMap_terminate = Scene_Map.prototype.terminate;
  Scene_Map.prototype.terminate = function() {
  	if (this._spriteset && this._spriteset._weatherField_1) {
  		this._spriteset.recordWeatherEXDataMap()
  	};
  	_mog_weatherEX_scMap_terminate.call(this);
  };

  //=============================================================================
  // ** Scene Battle
  //=============================================================================

  //==============================
  // * Terminate
  //==============================
  var _mog_weather_ex_scBattle_terminate = Scene_Battle.prototype.terminate;
  Scene_Battle.prototype.terminate = function() {
  	_mog_weather_ex_scBattle_terminate.call(this);
  	if (this._spriteset && this._spriteset._weatherField_1) {
  		this._spriteset.recordWeatherEXDataMap()
  	};
  };

  //=============================================================================
  // * SpriteWeatherEX
  //=============================================================================
  function SpriteWeatherEX() {
  	this.initialize.apply(this, arguments);
  };

  SpriteWeatherEX.prototype = Object.create(Sprite.prototype);
  SpriteWeatherEX.prototype.constructor = SpriteWeatherEX;

  //==============================
  // * Initialize
  //==============================
  SpriteWeatherEX.prototype.initialize = function(id) {
  	Sprite.prototype.initialize.call(this);
  	this._id = id;
  	this._cam = [0, 0, false, 0, 0];
  	this._modePosX = 0;
  	this._screenRX = Graphics.boxWidth;
  	this._screenRY = Graphics.boxHeight;
  	this._screenAn = Math.floor(this._screenRX / 13);
  	this._speed = 0;
  	this._imgChecked = false;
  	this._imgData = [];
  	this._camCheck = false;
  	this._rot = this.data().rot;
  	this.loadBitmapS();
  	this.createSprites();
  };

  //==============================
  // * record Weather EX Data
  //==============================
  SpriteWeatherEX.prototype.recordWeatherEXData = function() {
  	if (!$gameSystem._weatherSprites) {
  		$gameSystem._weatherSprites = []
  	};
  	$gameSystem._weatherSprites[this._id] = [];
  	for (var i = 0; i < this._sprites.length; i++) {
  		var sprite = this._sprites[i];
  		$gameSystem._weatherSprites[this._id][i] = {};
  		$gameSystem._weatherSprites[this._id][i].idS = sprite._id;
  		$gameSystem._weatherSprites[this._id][i].x = sprite.x;
  		$gameSystem._weatherSprites[this._id][i].y = sprite.x;
  		$gameSystem._weatherSprites[this._id][i].scaleX = sprite.scale.x;
  		$gameSystem._weatherSprites[this._id][i].scaleY = sprite.scale.y;
  		$gameSystem._weatherSprites[this._id][i].blendMode = sprite.blendMode;
  		$gameSystem._weatherSprites[this._id][i].anchorX = sprite.anchor.x;
  		$gameSystem._weatherSprites[this._id][i].anchorY = sprite.anchor.y;
  		$gameSystem._weatherSprites[this._id][i].rotation = sprite.rotation;
  		$gameSystem._weatherSprites[this._id][i].opacity = sprite.opacity;
  		$gameSystem._weatherSprites[this._id][i].realX = sprite._realX;
  		$gameSystem._weatherSprites[this._id][i].realY = sprite._realY;
  		$gameSystem._weatherSprites[this._id][i].sx = sprite._sx;
  		$gameSystem._weatherSprites[this._id][i].sy = sprite._sy;
  		$gameSystem._weatherSprites[this._id][i].rt = sprite._rt;
  		$gameSystem._weatherSprites[this._id][i].zx = sprite._zx;
  		$gameSystem._weatherSprites[this._id][i].zy = sprite._zy;
  		$gameSystem._weatherSprites[this._id][i].zx2 = sprite._zx2;
  		$gameSystem._weatherSprites[this._id][i].zy2 = sprite._zy2;
  		$gameSystem._weatherSprites[this._id][i].zp = sprite._zp;
  		$gameSystem._weatherSprites[this._id][i].ani = sprite._ani;
  		$gameSystem._weatherSprites[this._id][i].roll = sprite._roll;
  		$gameSystem._weatherSprites[this._id][i].frames = sprite._frames
  		$gameSystem._weatherSprites[this._id][i].originX = sprite.origin.x;
  		$gameSystem._weatherSprites[this._id][i].originY = sprite.origin.y;
  	};
  };

  //==============================
  // * Data
  //==============================
  SpriteWeatherEX.prototype.data = function() {
  	return $gameSystem._weatherEX_Data[this._id];
  };

  //==============================
  // * pre Data
  //==============================
  SpriteWeatherEX.prototype.preData = function() {
  	return $gameSystem._weatherSprites[this._id];
  };

  //==============================
  // * Load Bitmap S
  //==============================
  SpriteWeatherEX.prototype.loadBitmapS = function() {
  	this._image = ImageManager.loadWeather(this.data().fileName);
  };

  //==============================
  // * Need Check Img
  //==============================
  SpriteWeatherEX.prototype.needCheckImg = function() {
  	if (this._imgChecked) {
  		return false
  	};
  	if (this._image.width == 0) {
  		return false
  	};
  	return true
  };

  //==============================
  // * Mode
  //==============================
  SpriteWeatherEX.prototype.mode = function() {
  	return this.data().mode;
  };

  //==============================
  // * is Animated
  //==============================
  SpriteWeatherEX.prototype.isAnimated = function() {
  	return this.data().frames > 1;
  };

  //==============================
  // * Clear
  //==============================
  SpriteWeatherEX.prototype.clear = function(id) {
  	for (var i = 0; i < this._sprites.length; i++) {
  		this.removeChild(this._sprites[i])
  	};
  };

  //==============================
  // * Check Img Par
  //==============================
  SpriteWeatherEX.prototype.checkImgPar = function() {
  	this._imgChecked = true;
  	this._imgData = [];
  	this._imgData[0] = this._image.width;
  	this._imgData[1] = this._image.height;
  	this._imgData[2] = this._image.width / 2;
  	this._imgData[3] = this._image.height / 2;
  };

  //==============================
  // * is Tilling Weather
  //==============================
  SpriteWeatherEX.prototype.isTilingWeather = function() {
  	if (this.mode() == 32) {
  		return true
  	};
  	if (this.mode() == 33) {
  		return true
  	};
  	if (this.mode() == 34) {
  		return true
  	};
  	return false;
  };

  //==============================
  // * Create Sprites
  //==============================
  SpriteWeatherEX.prototype.createSprites = function() {
  	this._sprites = [];
  	for (var i = 0; i < this.data().power; i++) {
  		if (this.isTilingWeather()) {
  			this._sprites[i] = new TilingSprite(this._image);
  			this._sprites[i].tiling = true;
  			this._sprites[i].needRefreshMove = false;
  			if (Imported.MOG_BattleCameraFrontal && $gameParty.inBattle()) {
  				this.refreshTilingMove(this._sprites[i]);
  				this._sprites[i].refreshMove = false;
  			} else {
  				this._sprites[i].move(0, 0, Graphics.boxWidth + 32, Graphics.boxHeight + 32);
  			};
  			this._sprites[i].x = -16 + (Graphics.boxWidth / 2);
  			this._sprites[i].y = -16 + (Graphics.boxHeight / 2);
  		} else {
  			this._sprites[i] = new Sprite(this._image)
  		};
  		this._sprites[i].z = i;
  		this.setupBase(this._sprites[i], i);
  		this.refreshWeather(this._sprites[i], true);
  		if ($gameSystem._weatherEX_MapId == $gameMap._mapId) {
  			if ($gameSystem._weatherSprites && this.preData() && this.preData()[i]) {
  				this.loadPreData(this._sprites[i], this.preData()[i])
  			}
  		};
  		this.addChild(this._sprites[i]);
  	};
  };

  //==============================
  // * Refresh Tiling Move
  //==============================
  SpriteWeatherEX.prototype.refreshTilingMove = function(sprite) {
  	var w1 = Graphics.boxWidth;
  	var h1 = Graphics.boxHeight;
  	var w2 = (w1 * 130 / 100);
  	var h2 = (h1 * 130 / 100);
  	var w = w1 + w2 + 32;
  	var h = h1 + h2 + 32;
  	var x = (w2 / 3)
  	var y = (h2 / 3)
  	sprite.move(x, y, w, h);
  	sprite.refreshMove = true;
  };

  //==============================
  // * Setup Base
  //==============================
  SpriteWeatherEX.prototype.setupBase = function(sprite, index) {
  	sprite._id = index;
  	sprite.anchor.x = 0.5;
  	sprite.anchor.y = 0.5;
  	sprite.blendMode = this.data().blendMode
  	sprite.origin = new Point();
  	sprite._realX = 0;
  	sprite._realY = 0;
  	sprite._sx = 0;
  	sprite._sy = 0;
  	sprite._rt = 0;
  	sprite._op = 0;
  	sprite._zx = 0;
  	sprite._zy = 0;
  	sprite.originX = 0;
  	sprite.originY = 0;
  	sprite._zp = [1.00, 1.00];
  	sprite._ani = [false, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  	sprite._roll = 0;
  	sprite._wait = this.data().wait;
  	sprite._frames = [0, 0, 0, 0, 0];
  };

  //==============================
  // * set Cam Screen
  //==============================
  SpriteWeatherEX.prototype.setCamScreen = function() {
  	var camRange = $gameSystem._cam_data[1] / 100;
  	var center = [(Graphics.boxWidth / 2), (Graphics.boxHeight / 2)];
  	this._cam[0] = Math.floor(center[0] * camRange);
  	this._cam[1] = Math.floor(center[1] * camRange);
  	this._cam[2] = true;
  	this._screenRX = Graphics.boxWidth + (this._cam[0] * 2);
  	this._screenRY = Graphics.boxHeight + (this._cam[1] * 2);
  };

  //==============================
  // * set Frontal Camera
  //==============================
  SpriteWeatherEX.prototype.setFrontalCamera = function() {
  	this._cam[0] = Graphics.boxWidth * 50 / 100;
  	this._cam[1] = Graphics.boxHeight * 50 / 100;
  	this._cam[3] = Graphics.boxWidth / 2
  	this._cam[4] = Graphics.boxHeight / 2
  };

  //==============================
  // * loadPreData
  //==============================
  SpriteWeatherEX.prototype.loadPreData = function(sprite, data) {
  	sprite.x = data.x;
  	sprite.y = data.x;
  	sprite.scale.x = data.scaleX;
  	sprite.scale.y = data.scaleY;
  	sprite.anchor.x = data.anchorX;
  	sprite.anchor.y = data.anchorY;
  	sprite.blendMode = data.blendMode;
  	sprite.rotation = data.rotation;
  	sprite.opacity = data.opacity;
  	sprite._realX = data.realX;
  	sprite._realY = data.realY;
  	sprite._sx = data.sx;
  	sprite._sy = data.sy;
  	sprite._rt = data.rt;
  	sprite._zx = data.zx;
  	sprite._zy = data.zy;
  	sprite._zx2 = data.zx2;
  	sprite._zy2 = data.zy2;
  	sprite._zp = data.zp;
  	sprite._ani = data.ani;
  	sprite._roll = data.roll;
  	sprite._frames = data.frames;
  	sprite._id = data.idS;
  	sprite.origin.x = data.originX;
  	sprite.origin.y = data.originY;
  	if (this.isTilingWeather()) {
  		sprite.move(0, 0, Graphics.boxWidth + 32, Graphics.boxHeight + 32);
  		sprite.x = -16 + (Graphics.boxWidth / 2);
  		sprite.y = -16 + (Graphics.boxHeight / 2);
  	};
  };

  //==============================
  // * screen Y
  //==============================
  SpriteWeatherEX.prototype.screenX = function() {
  	if (this.needFixScreen()) {
  		return 0
  	};
  	return $gameMap.displayX() * $gameMap.tileWidth();
  };

  //==============================
  // * screen Y
  //==============================
  SpriteWeatherEX.prototype.screenY = function() {
  	if (this.needFixScreen()) {
  		return 0
  	};
  	return $gameMap.displayY() * $gameMap.tileHeight();
  };

  //==============================
  // * need Fix Screen
  //==============================
  SpriteWeatherEX.prototype.needFixScreen = function() {
  	if (this.needFixScreenMode()) {
  		return true
  	};
  	if ($gameParty.inBattle()) {
  		return true
  	};
  	return false;
  };

  //==============================
  // * need Fix Screen Mode
  //==============================
  SpriteWeatherEX.prototype.needFixScreenMode = function() {
  	if (this.mode() == 21) {
  		return true
  	};
  	return false;
  };

  //==============================
  // * screen limit X1
  //==============================
  SpriteWeatherEX.prototype.screenLimitX1 = function(sprite) {
  	return -(sprite.width + this._cam[0] + 96);
  };

  //==============================
  // * screen limit X2
  //==============================
  SpriteWeatherEX.prototype.screenLimitX2 = function(sprite) {
  	return this._screenRX + sprite.width + this._cam[0] + 96;
  };

  //==============================
  // * screen limit Y1
  //==============================
  SpriteWeatherEX.prototype.screenLimitY1 = function(sprite) {
  	return -(sprite.height + this._cam[1] + 96);
  };

  //==============================
  // * screen limit Y2
  //==============================
  SpriteWeatherEX.prototype.screenLimitY2 = function(sprite) {
  	return this._screenRY + sprite.height + this._cam[1] + 96;
  };

  //==============================
  // * random Pos X
  //==============================
  SpriteWeatherEX.prototype.randomPosX = function(sprite) {
  	sprite._realX = -(this._cam[0] + 50 + this._modePosX) + (Math.randomInt(this.screenX() + this._screenRX + 50 + this._cam[0] + this._cam[3]));
  };

  //==============================
  // * random Pos Y
  //==============================
  SpriteWeatherEX.prototype.randomPosY = function(sprite) {
  	sprite._realY = -(this._cam[1] + 50 + this._modePosX) + (Math.randomInt(this.screenY() + this._screenRY + 70 + this._cam[1] + this._cam[4]));
  };

  //==============================
  // * center Pos X
  //==============================
  SpriteWeatherEX.prototype.centerPosX = function(sprite) {
  	sprite._realX = -this._cam[0] + this.screenX() + (this._screenRX / 2);
  };

  //==============================
  // * center Pos Y
  //==============================
  SpriteWeatherEX.prototype.centerPosY = function(sprite) {
  	sprite._realY = -this._cam[1] + this.screenY() + (this._screenRY / 2);
  };

  //==============================
  // * Need Refresh Left
  //==============================
  SpriteWeatherEX.prototype.needRefrehLeft = function() {
  	return $gamePlayer._realX > $gamePlayer._x
  };

  //==============================
  // * Need Refresh Right
  //==============================
  SpriteWeatherEX.prototype.needRefrehRight = function() {
  	return $gamePlayer._realX < $gamePlayer._x
  };

  //==============================
  // * Need Refresh Upper
  //==============================
  SpriteWeatherEX.prototype.needRefrehUpper = function() {
  	return $gamePlayer._realY > $gamePlayer._y
  };

  //==============================
  // * Need Refresh Bottom
  //==============================
  SpriteWeatherEX.prototype.needRefrehBottom = function() {
  	return $gamePlayer._realY < $gamePlayer._y
  };

  //==============================
  // * Random Refresh Left
  //==============================
  SpriteWeatherEX.prototype.randomRefreshLeft = function() {
  	return $gamePlayer._realY < $gamePlayer._y
  };

  //==============================
  // * random Pos Y2
  //==============================
  SpriteWeatherEX.prototype.randomPosY2 = function(sprite) {
  	sprite._realY = -this._cam[1] + Math.randomInt(this.screenY() + this._screenRY + this._cam[1]);
  };

  //==============================
  // * upper Pos
  //==============================
  SpriteWeatherEX.prototype.upperPos = function(sprite, range) {
  	var rg = this._cam[0] ? this._cam[0] : range;
  	this.randomPosX(sprite);
  	sprite._realY = -rg + this.screenY();
  };

  //==============================
  // * bottom Pos
  //==============================
  SpriteWeatherEX.prototype.bottomPos = function(sprite, range) {
  	var rg = this._cam[1] ? this._cam[1] : range;
  	this.randomPosX(sprite);
  	sprite._realY = -rg + this.screenY() + this._screenRY;
  };

  //==============================
  // * bottom Pos
  //==============================
  SpriteWeatherEX.prototype.bottomPos2 = function(sprite) {
  	this.randomPosX(sprite);
  	var sp = Math.floor(this._screenRY / 4) + this._cam[1];
  	var sy = (this.screenY() + this._screenRY) - sp;
  	sprite._realY = -this._cam[1] + sy + Math.randomInt(sp);
  };

  //==============================
  // * bottom Pos
  //==============================
  SpriteWeatherEX.prototype.bottomPos3 = function(sprite) {
  	this.randomPosX(sprite);
  	var sp = Math.floor(this._screenRY / 2) + this._cam[0];
  	var sy = (this.screenY() + this._screenRY) - sp;
  	sprite._realY = -this._cam[1] + sy + Math.randomInt(sp);
  };

  //==============================
  // * Left Pos
  //==============================
  SpriteWeatherEX.prototype.leftPos = function(sprite, range) {
  	if (!range) {
  		range = 0
  	};
  	var rg = this._cam[0] ? this._cam[0] : range;
  	sprite._realX = -rg + this.screenX();
  	this.randomPosY(sprite);
  };

  //==============================
  // * right Pos
  //==============================
  SpriteWeatherEX.prototype.rightPos = function(sprite, range) {
  	if (!range) {
  		range = 0
  	};
  	var rg = this._cam[0] ? this._cam[0] : range;
  	sprite._realX = -rg + this.screenX() + this._screenRX;
  	this.randomPosY(sprite);
  };

  //==============================
  // * Set Pos Random
  //==============================
  SpriteWeatherEX.prototype.setPosRandom = function(sprite) {
  	this.randomPosX(sprite);
  	this.randomPosY(sprite);
  };

  //==============================
  // * Set Pos Normal
  //==============================
  SpriteWeatherEX.prototype.setPosNormal = function(sprite, range, opact) {
  	if (!range) {
  		range = 0
  	};
  	var pos = Math.randomInt(100, sprite);
  	if (this.needRefrehLeft()) {
  		if (pos < range) {
  			this.leftPos(sprite, 40);
  			if (opact) {
  				sprite.opacity = Math.randomInt(130) + 125
  			};
  		} else {
  			this.setPosRandom(sprite);
  		};
  	} else if (this.needRefrehRight()) {
  		if (pos < range) {
  			this.rightPos(sprite, -40);
  			if (opact) {
  				sprite.opacity = Math.randomInt(130) + 125
  			};
  		} else {
  			this.setPosRandom(sprite);
  		};
  	} else if (this.needRefrehBottom()) {
  		if (pos < range) {
  			this.bottomPos(sprite, -40);
  			if (opact) {
  				sprite.opacity = Math.randomInt(130) + 125
  			};
  		} else {
  			this.setPosRandom(sprite);
  		};
  	} else if (this.needRefrehUpper()) {
  		if (pos < range) {
  			this.upperPos(sprite, 40);
  			if (opact) {
  				sprite.opacity = Math.randomInt(130) + 125
  			};
  		} else {
  			this.setPosRandom(sprite);
  		};
  	} else {
  		this.setPosRandom(sprite);
  	};
  };

  //==============================
  // * Set Post Upper
  //==============================
  SpriteWeatherEX.prototype.setPosUpper = function(sprite, range) {
  	if (!range) {
  		range = 0
  	};
  	var pos = Math.randomInt(100, sprite);
  	if (this.needRefrehLeft()) {
  		if (pos < range) {
  			this.upperPos(sprite, 40);
  		} else {
  			this.leftPos(sprite, 40);
  		};
  	} else if (this.needRefrehRight()) {
  		if (pos < range) {
  			this.upperPos(sprite, 40);
  		} else {
  			this.rightPos(sprite, -40);
  		};
  	} else if (this.needRefrehBottom()) {
  		if (pos < range) {
  			this.upperPos(sprite, 40);
  		} else {
  			this.bottomPos(sprite, -40);
  		};
  	} else {
  		this.upperPos(sprite, 40);
  	};
  };

  //==============================
  // * Set Post Upper
  //==============================
  SpriteWeatherEX.prototype.setPosUpper_2 = function(sprite, range) {
  	if (!range) {
  		range = 0
  	};
  	var pos = Math.randomInt(100, sprite);
  	if (this.needRefrehLeft()) {
  		if (pos < range) {
  			this.upperPos(sprite, 40);
  		} else {
  			this.leftPos(sprite, 40);
  		};
  	} else if (this.needRefrehRight()) {
  		if (pos < range) {
  			this.upperPos(sprite, 40);
  		} else {
  			this.rightPos(sprite, -40);
  		};
  	} else if (this.needRefrehBottom()) {
  		if (pos < 30) {
  			this.leftPos(sprite, 40);
  		} else if (pos < 60) {
  			this.rightPos(sprite, 40);
  		} else {
  			this.bottomPos(sprite, -40);
  		};
  	} else {
  		this.upperPos(sprite, 40);
  	};
  };


  //==============================
  // * Set Post Left
  //==============================
  SpriteWeatherEX.prototype.setPosLeft = function(sprite) {
  	var pos = Math.randomInt(100);
  	if (this.needRefrehLeft()) {
  		this.leftPos(sprite, 40);
  	} else if (this.needRefrehRight()) {
  		if (pos < 30) {
  			this.rightPos(sprite, -40);
  		} else {
  			this.leftPos(sprite, 40)
  		};
  	} else if (this.needRefrehBottom()) {
  		if (pos < 60) {
  			this.bottomPos(sprite, -40);
  		} else {
  			this.leftPos(sprite, 40);
  		};
  	} else {
  		if (pos < 60) {
  			this.upperPos(sprite, 40);
  		} else {
  			this.leftPos(sprite, 40);
  		};
  	};
  };

  //==============================
  // * Set Post Left Upper
  //==============================
  SpriteWeatherEX.prototype.setPosLeftUpper = function(sprite) {
  	var pos = Math.randomInt(100);
  	if (this.needRefrehLeft()) {
  		if (pos < 40) {
  			this.upperPos(sprite, 40)
  		} else {
  			this.leftPos(sprite, 40);
  		};
  	} else if (this.needRefrehRight()) {
  		if (pos < 30) {
  			this.upperPos(sprite, 40);
  		} else if (pos < 50) {
  			this.leftPos(sprite, 40);
  		} else {
  			this.rightPos(sprite, -40);
  		};
  	} else if (this.needRefrehBottom()) {
  		if (pos < 30) {
  			this.upperPos(sprite, 40)
  		} else if (pos < 60) {
  			this.leftPos(sprite, 40);
  		} else {
  			this.bottomPos(sprite, -40);
  		};
  	} else {
  		if (pos < 50) {
  			this.leftPos(sprite, 40)
  		} else {
  			this.upperPos(sprite, 40);
  		};
  	};
  };

  //==============================
  // * Set Post Bottom
  //==============================
  SpriteWeatherEX.prototype.setPosBottom = function(sprite) {
  	var pos = Math.randomInt(100);
  	if (this.needRefrehLeft()) {
  		if (pos < 50) {
  			this.bottomPos(sprite, -40)
  		} else {
  			this.leftPos(sprite, 40);
  		};
  	} else if (this.needRefrehRight()) {
  		if (pos < 30) {
  			this.bottomPos(sprite, -40);
  		} else if (pos < 50) {
  			this.leftPos(sprite, 40);
  		} else {
  			this.rightPos(sprite, -40);
  		};
  	} else if (this.needRefrehUpper()) {
  		if (pos < 50) {
  			this.upperPos(sprite, 40)
  		} else {
  			this.bottomPos(sprite, -40);
  		};
  	} else {
  		if (pos < 50) {
  			this.leftPos(sprite, 40)
  		} else {
  			this.bottomPos(sprite, -40);
  		};
  	};
  };

  //==============================
  // * Set Post Bottom Right
  //==============================
  SpriteWeatherEX.prototype.setPosBottomRight = function(sprite) {
  	var pos = Math.randomInt(100);
  	if (this.needRefrehLeft()) {
  		if (pos < 50) {
  			this.bottomPos(sprite, -40)
  		} else {
  			this.leftPos(sprite, 40);
  		};
  	} else if (this.needRefrehRight()) {
  		if (pos < 30) {
  			this.bottomPos(sprite, -60);
  		} else if (pos < 50) {
  			this.leftPos(sprite, 40);
  		} else {
  			this.rightPos(sprite, -60);
  		};
  	} else if (this.needRefrehUpper()) {
  		if (pos < 50) {
  			this.upperPos(sprite, 40)
  		} else {
  			this.bottomPos(sprite, -60);
  		};
  	} else {
  		if (pos < 50) {
  			this.rightPos(sprite, -60)
  		} else {
  			this.bottomPos(sprite, -60);
  		};
  	};
  };

  //==============================
  // * Random Zoom
  //==============================
  SpriteWeatherEX.prototype.randomZoom = function(power, sprite, range) {
  	var rg = range ? range : 50
  	var pz = Math.randomInt(rg) * 0.01;
  	sprite.scale.x = (power + pz) * this.data().scale / 100;
  	sprite.scale.y = sprite.scale.x;
  	sprite._zp = [sprite.scale.x, sprite.scale.y];
  };

  //==============================
  // * need Refresh Weather
  //==============================
  SpriteWeatherEX.prototype.needRefreshWeather = function(sprite) {
  	if (this.needFixScreenMode()) {
  		return false
  	};
  	if (sprite.x < this.screenLimitX1(sprite)) {
  		return true
  	};
  	if (sprite.x > this.screenLimitX2(sprite)) {
  		return true
  	};
  	if (sprite.y < this.screenLimitY1(sprite)) {
  		return true
  	};
  	if (sprite.y > this.screenLimitY2(sprite)) {
  		return true
  	};
  	return false;
  };

  //==============================
  // * need Refresh Weather
  //==============================
  SpriteWeatherEX.prototype.needInitialRandomPos = function() {
  	if (this.mode() == 21) {
  		return false
  	};
  	if (this.mode() == 35) {
  		return false
  	};
  	return true;
  };

  //==============================
  // * refresh Weather
  //==============================
  SpriteWeatherEX.prototype.refreshWeather = function(sprite, initial) {
  	switch (this.mode()) {
  		case 0:
  			this.setupWind1(sprite);
  			break;
  		case 1:
  			this.setupWind2(sprite);
  			break;
  		case 2:
  			this.setupWind3(sprite);
  			break;
  		case 3:
  			this.setupSpark1(sprite);
  			break;
  		case 4:
  			this.setupSpark2(sprite);
  			break;
  		case 5:
  			this.setupSpark3(sprite);
  			break;
  		case 6:
  			this.setupFire1(sprite);
  			break;
  		case 7:
  			this.setupFire2(sprite);
  			break;
  		case 8:
  			this.setupFire3(sprite);
  			break;
  		case 9:
  			this.setupSnow1(sprite);
  			break;
  		case 10:
  			this.setupSnow2(sprite);
  			break;
  		case 11:
  			this.setupSnow3(sprite);
  			break;
  		case 12:
  			this.setupRain1(sprite);
  			break;
  		case 13:
  			this.setupRain2(sprite);
  			break;
  		case 14:
  			this.setupRain3(sprite);
  			break;
  		case 15:
  			this.setupCloud1(sprite);
  			break;
  		case 16:
  			this.setupCloud2(sprite);
  			break;
  		case 17:
  			this.setupCloud3(sprite);
  			break;
  		case 18:
  			this.setupRandom1(sprite);
  			break;
  		case 19:
  			this.setupRandom2(sprite);
  			break;
  		case 20:
  			this.setupRandom3(sprite);
  			break;
  		case 21:
  			this.setupSunLight1(sprite);
  			break;
  		case 22:
  			this.setupFog1(sprite, initial);
  			break;
  		case 23:
  			this.setupFog2(sprite, initial);
  			break;
  		case 24:
  			this.setupFog3(sprite, initial);
  			break;
  		case 25:
  			this.setupStar1(sprite, initial);
  			break;
  		case 26:
  			this.setupStar2(sprite, initial);
  			break;
  		case 27:
  			this.setupShinning(sprite, initial);
  			break;
  		case 28:
  			this.setupBounce(sprite, initial);
  			break;
  		case 29:
  			this.setupSpark4(sprite, initial);
  			break;
  		case 30:
  			this.setupBubble(sprite, initial);
  			break;
  		case 31:
  			this.setupStandStill(sprite, initial);
  			break;
  		case 32:
  			this.setupFogXP1(sprite, initial);
  			break;
  		case 33:
  			this.setupFogXP2(sprite, initial);
  			break;
  		case 34:
  			this.setupParallax1(sprite, initial);
  			break;
  		case 35:
  			this.setupParallax2(sprite, initial);
  			break;
  		default:
  			this.setupRandom3(sprite);
  			break;

  	};
  	if (initial) {
  		if ($gameParty.inBattle()) {
  			if (Imported.MOG_BattleCameraFrontal) {
  				this.setFrontalCamera()
  			};
  			if (Imported.MOG_BattleCamera) {
  				this.setCamScreen()
  			};
  		};
  		sprite._ani[6] = 5;
  		if (this.needInitialRandomPos()) {
  			this.setPosRandom(sprite)
  		};
  		this.updateEffects(sprite)
  	} else {
  		if (sprite._ani[6] > 0) {
  			sprite._ani[7] = Math.randomInt(120)
  		};
  	};
  };

  //==============================
  // * Update Effects
  //==============================
  SpriteWeatherEX.prototype.updateEffects = function(sprite) {
  	switch (this.mode()) {
  		case 0:
  			this.updateWind(sprite);
  			break;
  		case 1:
  			this.updateWind(sprite);
  			break;
  		case 2:
  			this.updateWind3(sprite);
  			break;
  		case 3:
  			this.updateSpark(sprite);
  			break;
  		case 4:
  			this.updateSpark2(sprite);
  			break;
  		case 5:
  			this.updateSpark3(sprite);
  			break;
  		case 6:
  			this.updateFire(sprite);
  			break;
  		case 7:
  			this.updateFire(sprite);
  			break;
  		case 8:
  			this.updateFire3(sprite);
  			break;
  		case 9:
  			this.updateSnow(sprite);
  			break;
  		case 10:
  			this.updateSnow(sprite);
  			break;
  		case 11:
  			this.updateSnow3(sprite);
  			break;
  		case 12:
  			this.updateRain1(sprite);
  			break;
  		case 13:
  			this.updateRain2(sprite);
  			break;
  		case 14:
  			this.updateRain3(sprite);
  			break;
  		case 15:
  			this.updateCloud1(sprite);
  			break;
  		case 16:
  			this.updateCloud2(sprite);
  			break;
  		case 17:
  			this.updateCloud3(sprite);
  			break;
  		case 18:
  			this.updateRandom1(sprite);
  			break;
  		case 19:
  			this.updateRandom2(sprite);
  			break;
  		case 20:
  			this.updateRandom3(sprite);
  			break;
  		case 21:
  			this.updateSunLight(sprite);
  			break;
  		case 22:
  			this.updateFog1(sprite);
  			break;
  		case 23:
  			this.updateFog1(sprite);
  			break;
  		case 24:
  			this.updateFog1(sprite);
  			break;
  		case 25:
  			this.updateStar1(sprite);
  			break;
  		case 26:
  			this.updateStar2(sprite);
  			break;
  		case 27:
  			this.updateShinning(sprite);
  			break;
  		case 28:
  			this.updateBounce(sprite);
  			break;
  		case 29:
  			this.updateSpark4(sprite);
  			break;
  		case 30:
  			this.updateBubble(sprite);
  			break;
  		case 31:
  			this.updateStandStill(sprite);
  			break;
  		case 32:
  			this.updateScroll(sprite);
  			break;
  		case 33:
  			this.updateScroll(sprite);
  			break;
  		case 34:
  			this.updateParallax1(sprite);
  			break;
  		case 35:
  			this.updateParallax2(sprite);
  			break;
  		default:
  			this.updateRandom1(sprite);
  			break;
  	};
  	sprite._wait = this.data().wait;
  };

  //==============================
  // * Setup Bounce
  //==============================
  SpriteWeatherEX.prototype.setupBounce = function(sprite, initial) {
  	this.setPosNormal(sprite, 40);
  	this.randomZoom(0.50, sprite);
  	sprite.anchor.x = 0.5;
  	sprite.anchor.y = 0.5;
  	sprite._ani[1] = -90 - Math.randomInt(90);
  	sprite._ani[2] = 0;
  	sprite._ani[3] = (Math.randomInt(90) + 60) * this.speed() / 100;
  	sprite._ani[5] = 0;
  	sprite._ani[6] = 0;
  	sprite._zx = 2
  	if (initial || sprite.opacity > 0) {
  		var rd = Math.randomInt(100)
  		if (rd > 60) {
  			sprite._ani[1] = -(Math.randomInt(100) + 20);
  			sprite._ani[3] = (Math.randomInt(80))
  			sprite.opacity = Math.randomInt(150) + 50;
  		};
  	} else {
  		sprite.opacity = 0;
  	};
  	var rg = Math.randomInt(96) - 48;
  	sprite.rotation = (rg * Math.PI / 180);
  };

  //==============================
  // * Update Bounce
  //==============================
  SpriteWeatherEX.prototype.updateBounce = function(sprite) {
  	sprite._ani[3]--;
  	if (sprite._ani[3] <= 0) {
  		sprite.opacity -= 3;
  		if (sprite.opacity === 0) {
  			this.refreshWeather(sprite)
  		}
  	} else {
  		sprite.opacity += 15;
  	};
  	sprite._ani[2] += 0.5;
  	sprite._ani[1] += sprite._ani[2];
  	if (sprite._ani[1] >= 0) {
  		sprite._ani[1] = 0;
  		sprite._ani[2] *= -0.6;
  	};
  	sprite.x = sprite._realX - this.screenX();
  	sprite.y = sprite._realY + Math.round(sprite._ani[1]) - this.screenY();
  };

  //==============================
  // * Setup Wind 1
  //==============================
  SpriteWeatherEX.prototype.setupWind1 = function(sprite) {
  	this.setPosLeftUpper(sprite);
  	this.randomZoom(0.50, sprite);
  	sprite.anchor.x = 0;
  	sprite.anchor.y = 0;
  	sprite._rt = Math.random() * 0.1;
  	sprite.opacity = 0;
  	sprite._sx = (this._speed + 1.5 + Math.random() * 3);
  	sprite._sy = (this._speed + 1.0 + Math.random() * 3);
  	sprite._roll = Math.randomInt(60);
  };

  //==============================
  // * Update Wind
  //==============================
  SpriteWeatherEX.prototype.updateWind = function(sprite) {
  	this.updateRollEffect(sprite);
  	sprite.opacity += 25;
  };

  //==============================
  // * Setup Wind
  //==============================
  SpriteWeatherEX.prototype.setupWind2 = function(sprite) {
  	this.setPosLeft(sprite);
  	sprite.anchor.x = -1;
  	sprite.anchor.y = -1;
  	sprite._rt = Math.random() * 0.1;
  	this.randomZoom(0.50, sprite);
  	sprite.opacity = 0;
  	sprite._sx = (this._speed + 2.5 + Math.random() * 3);
  	sprite._roll = Math.randomInt(60);
  };

  //==============================
  // * Setup Wind
  //==============================
  SpriteWeatherEX.prototype.setupWind3 = function(sprite) {
  	this.setPosLeft(sprite);
  	this.randomZoom(0.50, sprite);
  	sprite.opacity = 0;
  	sprite.anchor.x = -1;
  	sprite.anchor.y = -1;
  	sprite._rt = Math.random() * 0.1;
  	sprite._sx = (this._speed + 2 + Math.random() * 3);
  	sprite._sy = -1
  	sprite._zx = 0.01 + Math.randomInt(2) * 0.01;
  	sprite._zy = sprite._zx;
  	sprite._roll = Math.randomInt(60);
  };


  //==============================
  // * Update Wind
  //==============================
  SpriteWeatherEX.prototype.updateWind = function(sprite) {
  	this.updateRollEffect(sprite);
  	sprite.opacity += 25;
  };

  //==============================
  // * Update Wind 3
  //==============================
  SpriteWeatherEX.prototype.updateWind3 = function(sprite) {
  	this.updateScale(sprite);
  	if (sprite.scale.x < 3.0) {
  		sprite.opacity += 25;
  	} else {
  		sprite.opacity -= 3;
  		if (sprite.opacity === 0) {
  			this.refreshWeather(sprite)
  		}
  	};
  	sprite.scale.y = sprite.scale.x;
  };

  //==============================
  // * Setup Spark 1
  //==============================
  SpriteWeatherEX.prototype.setupSpark1 = function(sprite) {
  	this.setPosBottom(sprite);
  	sprite.anchor.x = 0;
  	sprite.anchor.y = 0;
  	sprite._rt = Math.random() * 0.1;
  	this.randomZoom(0.50, sprite);
  	sprite.opacity = 0;
  	sprite._sy = -(this._speed + 1.0 + Math.random() * 3);
  };

  //==============================
  // * Update Spark
  //==============================
  SpriteWeatherEX.prototype.updateSpark = function(sprite) {
  	sprite.opacity += 25;
  };

  //==============================
  // * Setup Spark 2
  //==============================
  SpriteWeatherEX.prototype.setupSpark2 = function(sprite) {
  	this.setPosNormal(sprite, 20);
  	sprite.anchor.x = 0.5;
  	sprite.anchor.y = 0.5;
  	this.randomZoom(0.10, sprite);
  	sprite.opacity = 0;
  	sprite._zx = 0.01 + Math.randomInt(1) * 0.01;
  	sprite._zy = this._zx;
  	sprite._sy = -(this._speed + 0.5 + Math.random() * 1);
  };

  //==============================
  // * Update Spark 2
  //==============================
  SpriteWeatherEX.prototype.updateSpark2 = function(sprite) {
  	if (sprite.scale.x < 0.8) {
  		this.updateScale(sprite);
  		sprite.opacity += 25;
  	} else {
  		sprite.opacity -= 10;
  		if (sprite.opacity === 0) {
  			this.refreshWeather(sprite)
  		};
  	};
  	sprite.scale.y = sprite.scale.x;
  };


  //==============================
  // * Setup Spark3
  //==============================
  SpriteWeatherEX.prototype.setupSpark3 = function(sprite) {
  	this.setPosNormal(sprite, 20);
  	this.randomZoom(0.50, sprite);
  	sprite._ani[0] = false;
  	sprite.anchor.x = 0;
  	sprite.anchor.y = 0;
  	sprite.opacity = 0;
  	this.refreshFireFly(sprite)
  	sprite._ani[2] = sprite._ani[1] * 2;
  };

  //==============================
  // * refresh Fire Fly
  //==============================
  SpriteWeatherEX.prototype.refreshFireFly = function(sprite) {
  	sprite._ani[1] = Math.randomInt(60, sprite) + 60;
  	var dir = Math.randomInt(2);
  	var dir2 = (this._speed + 0.1 + Math.random() * 0.1);
  	var dir3 = (this._speed + 0.1 + Math.random() * 0.1);
  	sprite._sx = dir === 0 ? dir2 : -dir2;
  	sprite._sy = dir === 0 ? dir3 : -dir3;
  	sprite._rt = dir === 0 ? (Math.random() * 0.05) : -(Math.random() * 0.05);
  	sprite._ani[1] = Math.randomInt(60) + 90;
  };

  //==============================
  // * Update Spark 3
  //==============================
  SpriteWeatherEX.prototype.updateSpark3 = function(sprite) {
  	sprite._ani[1]--;
  	sprite._ani[2]--;
  	if (sprite._ani[1] <= 0) {
  		this.refreshFireFly(sprite)
  	};
  	if (sprite._ani[2] < 0) {
  		sprite.opacity -= 10;
  		if (sprite.opacity === 0) {
  			this.refreshWeather(sprite)
  		}
  	} else {
  		sprite.opacity += 5;
  	};
  };

  //==============================
  // * Setup Spark 4
  //==============================
  SpriteWeatherEX.prototype.setupSpark4 = function(sprite, initial) {
  	this.setPosBottomRight(sprite);
  	sprite.anchor.x = 0.5;
  	sprite.anchor.y = 0;
  	this.randomZoom(0.20, sprite, 150);
  	var rg = Math.randomInt(360);
  	sprite.rotation = (rg * Math.PI / 180);
  	sprite.opacity = Math.randomInt(255);
  	sprite._ani[1] = -((sprite.scale.x * 2) + (Math.randomInt(10) * 0.01)) / 3;
  	sprite._ani[2] = -((sprite.scale.y * 3) + (Math.randomInt(10) * 0.01)) / 3;
  	if (sprite._ani[2] < -0.3) {
  		sprite._ani[2] = -0.3
  	};
  	sprite._ani[3] = 9999 //sprite.scale.x > 0.60 ? Math.randomInt(320) + 400 : 1200;
  	sprite._ani[4] = Math.randomInt(90) + 30;
  	sprite._ani[5] = 0.01;
  	var rd = Math.randomInt(100);
  	sprite._ani[8] = rd < 35 ? 0 : 1;
  	sprite._ani[9] = sprite._ani[2];
  	sprite._ani[10] = 0;
  	sprite._ani[11] = 0;
  	sprite._sx = sprite._ani[1];
  	sprite._sy = sprite._ani[2];
  };

  //==============================
  // * Update Spark
  //==============================
  SpriteWeatherEX.prototype.updateSpark4 = function(sprite) {
  	if (sprite._ani[11] == 0) {
  		sprite.opacity += 3;
  		if (sprite.opacity >= 255) {
  			sprite._ani[11] = 1;
  		};
  	} else {
  		sprite.opacity -= 3;
  		if (sprite.opacity <= 65) {
  			sprite._ani[11] = 0;
  		};
  	};
  	sprite._sx = sprite._ani[1];
  	sprite._sy = sprite._ani[2];
  	if (sprite._ani[4] > 0 || sprite._ani[8]) {
  		sprite._ani[4]--;
  		return
  	};
  	if (sprite._ani[10] == 0) {
  		sprite._ani[2] += sprite._ani[5];
  		if (sprite._ani[2] >= 0.2) {
  			sprite._ani[2] = 0.2;
  			sprite._ani[10] = 1;
  		};
  	} else {
  		sprite._ani[2] -= sprite._ani[5];
  		if (sprite._ani[2] <= sprite._ani[9]) {
  			sprite._ani[2] = sprite._ani[9];
  			sprite._ani[10] = 0;
  			sprite._ani[4] = Math.randomInt(90) + 30;
  		};
  	};
  };

  //==============================
  // * Setup Bubble
  //==============================
  SpriteWeatherEX.prototype.setupBubble = function(sprite, initial) {
  	this.setPosNormal(sprite, 40);
  	this.randomZoom(0.80, sprite);
  	sprite.opacity = 0;
  	sprite.anchor.x = 0.5;
  	sprite.anchor.y = 0.5;
  	sprite._zx = 0;
  	sprite._zy = 0
  	sprite._ani[1] = 0;
  	sprite._ani[2] = Math.randomInt(5) + 20;
  	sprite._ani[3] = (Math.randomInt(70) * 0.01) + 0.1;
  	var rg = Math.randomInt(96) - 48;
  	sprite.rotation = (rg * Math.PI / 180);
  };

  //==============================
  // * Update Bubble
  //==============================
  SpriteWeatherEX.prototype.updateBubble = function(sprite) {
  	this.updateScale(sprite);
  	sprite._ani[2]--;
  	if (sprite._ani[1] == 0) {
  		sprite._sy = -sprite._ani[3] * 4;
  		sprite.opacity += 15;
  		if (sprite._ani[2] <= 0) {
  			sprite._ani[1] = 1;
  			sprite._ani[2] = (Math.randomInt(180) + 180) * this.speed() / 100;
  		};
  	} else if (sprite._ani[1] == 1) {
  		sprite._sy = -sprite._ani[3];
  		sprite.opacity += 15;
  		if (sprite._ani[2] <= 0) {
  			sprite._ani[1] = 2;
  			sprite._zx = +(0.01 + Math.randomInt(1) * 0.01);
  			sprite._zy = sprite._zx;
  		}
  	} else {
  		sprite.opacity -= 2;
  		if (sprite.opacity <= 0) {
  			if (sprite.opacity === 0) {
  				this.refreshWeather(sprite)
  			};
  		};
  	};
  };

  //==============================
  // * Setup Fire 1
  //==============================
  SpriteWeatherEX.prototype.setupFire1 = function(sprite) {
  	var pos = Math.randomInt(100, sprite);
  	if (pos < 50) {
  		this.bottomPos(sprite, 30);
  		sprite._sy = -(this._speed + 1.5 + Math.random() * 1);
  	} else {
  		this.upperPos(sprite, 30);
  		sprite._sy = (this._speed + 1.5 + Math.random() * 1);
  	};
  	sprite.anchor.x = 0;
  	sprite.anchor.y = 0;
  	this.randomZoom(0.50, sprite);
  	sprite.opacity = 0;
  	sprite._zx = 0.01 + Math.randomInt(1) * 0.01;
  	sprite._zy = sprite._zx;
  	var dir = Math.randomInt(2, sprite);
  	sprite._rt = dir === 0 ? (Math.random() * 0.1) : -(Math.random() * 0.1);
  };

  //==============================
  // * Update Fire
  //==============================
  SpriteWeatherEX.prototype.updateFire = function(sprite) {
  	if (sprite.scale.x < 1.0) {
  		this.updateScale(sprite);
  		sprite.opacity += 25;
  	} else {
  		sprite.opacity -= 15
  		if (sprite.opacity === 0) {
  			this.refreshWeather(sprite)
  		}
  	};
  	sprite.scale.y = sprite.scale.x;
  };

  //==============================
  // * Setup Fire 2
  //==============================
  SpriteWeatherEX.prototype.setupFire2 = function(sprite) {
  	var pos = Math.randomInt(100);
  	this.bottomPos2(sprite);
  	sprite._sy = -(this._speed + 1.5 + Math.random() * 1);
  	sprite.anchor.x = 0;
  	sprite.anchor.y = 0;
  	this.randomZoom(0.50, sprite);
  	sprite.opacity = 0;
  	sprite._zx = 0.01 + Math.randomInt(1) * 0.01;
  	sprite._zy = sprite._zx;
  	var dir = Math.randomInt(2);
  	sprite._rt = dir === 0 ? (Math.random() * 0.1) : -(Math.random() * 0.1)
  };

  //==============================
  // * Setup Fire 3
  //==============================
  SpriteWeatherEX.prototype.setupFire3 = function(sprite) {
  	this.setPosNormal(sprite, 20);
  	this.randomZoom(0.10, sprite);
  	sprite.anchor.x = 0.5;
  	sprite.anchor.y = 0.5;
  	sprite.opacity = 0;
  	sprite._zx = (0.1 + Math.randomInt(2) * 0.1);
  	sprite._zy = sprite._zx;
  	sprite._ani[1] = Math.randomInt(30);
  };

  //==============================
  // * Update Fire 3
  //==============================
  SpriteWeatherEX.prototype.updateFire3 = function(sprite) {
  	sprite._ani[1]--;
  	if (sprite._ani[1] > 0) {
  		return
  	};
  	this.updateScale(sprite);
  	if (sprite.scale.x > 2.0) {
  		sprite.opacity -= 5;
  		if (sprite.opacity === 0) {
  			this.refreshWeather(sprite)
  		}
  	} else {
  		sprite.opacity += 25;
  	}
  };

  //==============================
  // * Setup Snow 1
  //==============================
  SpriteWeatherEX.prototype.setupSnow1 = function(sprite) {
  	this.setPosUpper(sprite, 40);
  	sprite.anchor.x = 0;
  	sprite.anchor.y = 0;
  	sprite._rt = Math.random() * 0.05;
  	this.randomZoom(0.50, sprite);
  	sprite.opacity = 0;
  	sprite._sy = (this._speed + 1.5 + Math.random() * 2);
  };

  //==============================
  // * Update Snow
  //==============================
  SpriteWeatherEX.prototype.updateSnow = function(sprite) {
  	sprite.opacity += 25;
  };

  //==============================
  // * Setup Snow 2
  //==============================
  SpriteWeatherEX.prototype.setupSnow2 = function(sprite) {
  	this.setPosUpper_2(sprite, 10);
  	sprite.anchor.x = 0;
  	sprite.anchor.y = 0;
  	this.randomZoom(0.50, sprite);
  	sprite.opacity = 0;
  	sprite._sy = (this._speed + 2 + Math.random() * 3);
  	var dir = Math.randomInt(2);
  	var dir2 = (this._speed + 2 + Math.random() * 3);
  	sprite._sx = dir === 0 ? dir2 : -dir2;
  	sprite._rt = dir === 0 ? (Math.random() * 0.1) : -(Math.random() * 0.1)
  };

  //==============================
  // * Setup Snow 3
  //==============================
  SpriteWeatherEX.prototype.setupSnow3 = function(sprite) {
  	if ($gamePlayer.isMoving()) {
  		this.setPosUpper(sprite);
  	} else {
  		this.setPosRandom(sprite);
  	};
  	sprite.anchor.x = 0.5;
  	sprite.anchor.y = 0.5;
  	sprite._rt = Math.random() * 0.01;
  	this.randomZoom(1.50, sprite);
  	sprite._ani[1] = sprite.scale.x;
  	this.randomZoom(0.01, sprite);
  	sprite.opacity = 0;
  	sprite._zx = (0.05 + Math.randomInt(1) * 0.01);
  	sprite._zy = sprite._zx;
  	sprite._sy = (this._speed + 1.5 + Math.random() * 2);
  	sprite._ani[2] = sprite._sy;
  	sprite._sy = 0;
  };

  //==============================
  // * Update Snow 3
  //==============================
  SpriteWeatherEX.prototype.updateSnow3 = function(sprite) {
  	sprite.opacity += 25;
  	if (sprite.scale.x < sprite._ani[1]) {
  		this.updateScale(sprite);
  	} else {
  		sprite._sy = sprite._ani[2];
  	}
  };

  //==============================
  // * Setup Rain 1
  //==============================
  SpriteWeatherEX.prototype.setupRain1 = function(sprite) {
  	this.setPosUpper(sprite, 50);
  	sprite.anchor.x = 0.5;
  	sprite.anchor.y = 0.5;
  	this.randomZoom(0.50, sprite);
  	sprite.opacity = 0;
  	sprite._sy = (this._speed + 5 + Math.random() * 3);
  };

  //==============================
  // * Update Rain
  //==============================
  SpriteWeatherEX.prototype.updateRain1 = function(sprite) {
  	sprite.opacity += 25;
  };

  //==============================
  // * Setup Rain 2
  //==============================
  SpriteWeatherEX.prototype.setupRain2 = function(sprite) {
  	this.randomPosX(sprite);
  	this.randomPosY(sprite);
  	sprite.anchor.x = 0.5;
  	sprite.anchor.y = 0.5;
  	this.randomZoom(0.50, sprite);
  	sprite.opacity = 0;
  	sprite._zx = 0.2;
  	sprite._zy = sprite._zx;
  	sprite._sy = (this._speed + 5 + Math.random() * 3);
  	sprite._ani[1] = Math.randomInt(30);
  };

  //==============================
  // * Update Rain 2
  //==============================
  SpriteWeatherEX.prototype.updateRain2 = function(sprite) {
  	sprite.opacity += 25;
  	sprite._ani[1]--;
  	if (sprite._ani[1] <= 0) {
  		this.updateScale(sprite);
  		sprite._sy = 0;
  		sprite.opacity -= 75
  		if (sprite.opacity === 0) {
  			this.refreshWeather(sprite)
  		}
  	};
  };

  //==============================
  // * Setup Rain 3
  //==============================
  SpriteWeatherEX.prototype.setupRain3 = function(sprite) {
  	var pos = Math.randomInt(100);
  	if (pos < 50) {
  		this.upperPos(sprite);
  	} else {
  		this.randomPosX(sprite);
  		this.randomPosY(sprite);
  	};
  	sprite.anchor.x = 0.5;
  	sprite.anchor.y = 0.5;
  	this.randomZoom(0.50, sprite);
  	sprite._ani[1] = sprite.scale.x;
  	this.randomZoom(5.50, sprite);
  	sprite.opacity = 0;
  	sprite._sx = (this._speed + 3 + Math.random() * 3);
  	sprite._sy = (this._speed + 6 + Math.random() * 4);
  	sprite._zx = -(0.1 + Math.randomInt(1) * 0.05);
  	sprite._zy = sprite._zx;
  };

  //==============================
  // * Update Rain 3
  //==============================
  SpriteWeatherEX.prototype.updateRain3 = function(sprite) {
  	sprite.opacity += 25;
  	this.updateScale(sprite);
  	if (sprite.scale.x <= 0.10) {
  		this.refreshWeather(sprite)
  	}
  };

  //==============================
  // * Setup Cloud 1
  //==============================
  SpriteWeatherEX.prototype.setupCloud1 = function(sprite) {
  	this.setPosNormal(sprite, 20);
  	sprite.anchor.x = 0.5;
  	sprite.anchor.y = 0.5;
  	this.randomZoom(0.50, sprite);
  	sprite.opacity = 0;
  	sprite._sx = (this._speed + 1 + Math.random() * 2);
  };

  //==============================
  // * Update Cloud 1
  //==============================
  SpriteWeatherEX.prototype.updateCloud1 = function(sprite) {
  	sprite.opacity += 5;
  };

  //==============================
  // * Setup Cloud 2
  //==============================
  SpriteWeatherEX.prototype.setupCloud2 = function(sprite) {
  	this.setPosNormal(sprite, 20);
  	sprite.anchor.x = 0.5;
  	sprite.anchor.y = 0.5;
  	this.randomZoom(0.10, sprite);
  	sprite.opacity = 0;
  	sprite._zx = 0.01 + Math.randomInt(1) * 0.01;
  	sprite._zy = sprite._zx;
  	sprite._sy = (this._speed + 1.5 + Math.random() * 2.5);
  };

  //==============================
  // * Update Cloud 2
  //==============================
  SpriteWeatherEX.prototype.updateCloud2 = function(sprite) {
  	this.updateScale(sprite);
  	if (sprite.scale.x < 1.5) {
  		sprite.opacity += 5;
  	} else {
  		sprite.opacity -= 5
  		if (sprite.opacity === 0) {
  			this.refreshWeather(sprite)
  		}
  	};
  };

  //==============================
  // * Setup Cloud 3
  //==============================
  SpriteWeatherEX.prototype.setupCloud3 = function(sprite) {
  	var dir = Math.randomInt(3);
  	sprite._ani[1] = dir;
  	if (dir === 0) {
  		this.leftPos(sprite, 30);
  		this.randomZoom(0.50, sprite);
  		sprite._ani[0] = false;
  		sprite._sx = (this._speed + 5 + Math.random() * 5);
  	} else if (dir === 1) {
  		this.leftPos(sprite, 30);
  		this.randomZoom(1.00, sprite);
  		sprite._ani[0] = false;
  		sprite._sx = (this._speed + 10 + Math.random() * 5);
  	} else {
  		this.leftPos(sprite, 30);
  		this.randomZoom(1.50, sprite);
  		sprite._ani[0] = true;
  		sprite._sx = (this._speed + 15 + Math.random() * 5);
  	};
  	sprite._zx = -(0.02 + Math.randomInt(1) * 0.01);
  	sprite._zy = sprite._zx;
  	sprite.anchor.x = 0.5;
  	sprite.anchor.y = 0.5;
  	sprite.opacity = 0;
  };

  //==============================
  // * Update Cloud 3
  //==============================
  SpriteWeatherEX.prototype.updateCloud3 = function(sprite) {
  	sprite.opacity += 25
  };

  //==============================
  // * Setup Random
  //==============================
  SpriteWeatherEX.prototype.setupRandom1 = function(sprite) {
  	this.setPosNormal(sprite, 20);
  	var dir = Math.randomInt(2);
  	var sx = (this._speed + 5 + Math.random() * 3);
  	this._sx = dir === 0 ? sx : -sx;
  	var dir = Math.randomInt(2);
  	var sy = (this._speed + 5 + Math.random() * 3);
  	sprite._sy = dir === 0 ? sy : -sy;
  	sprite.anchor.x = 0.5;
  	sprite.anchor.y = 0.5;
  	sprite.opacity = 0;
  };

  //==============================
  // * Update Random
  //==============================
  SpriteWeatherEX.prototype.updateRandom1 = function(sprite) {
  	sprite.opacity += 25;
  };

  //==============================
  // * Setup Random 2
  //==============================
  SpriteWeatherEX.prototype.setupRandom2 = function(sprite) {
  	var dir = Math.randomInt(2);
  	if (dir === 0) {
  		sprite._sx = (this._speed + 5 + Math.random() * 3);
  		sprite._sy = -(this._speed + 1 + Math.random() * 3);
  	} else {
  		sprite._sx = -(this._speed + 5 + Math.random() * 3);
  		sprite._sy = (this._speed + 1 + Math.random() * 3);
  	};
  	this.randomZoom(0.50, sprite);
  	this.setPosNormal(sprite, 20);
  	sprite.anchor.x = -1;
  	sprite.anchor.y = 1;
  	sprite._rt = Math.randomInt(10) * 0.01;
  	sprite._zx = 0.02 + Math.randomInt(1) * 0.02;
  	sprite._zy = sprite._zx;
  	sprite.opacity = 0;
  };

  //==============================
  // * Update Random 2
  //==============================
  SpriteWeatherEX.prototype.updateRandom2 = function(sprite) {
  	sprite.opacity += 25;
  	this.updateScale(sprite);
  };

  //==============================
  // * Setup Random 3
  //==============================
  SpriteWeatherEX.prototype.setupRandom3 = function(sprite) {
  	var dir = Math.randomInt(2);
  	if (dir === 0) {
  		this.leftPos(sprite, 30);
  		this.randomZoom(0.50, sprite);
  		sprite._sx = (this._speed + 4 + Math.random() * 3);
  		sprite._sy = -(this._speed + 0.1 + Math.random() * 0.5);
  	} else {
  		this.rightPos(sprite, 30);
  		this.randomZoom(1.50, sprite);
  		sprite._sx = -(this._speed + 5 + Math.random() * 3);
  		sprite._sy = (this._speed + 1 + Math.random() * 3);
  	};
  	sprite.anchor.x = 0.5;
  	sprite.anchor.y = 0.5;
  	sprite.opacity = 0;
  };

  //==============================
  // * Update Random3
  //==============================
  SpriteWeatherEX.prototype.updateRandom3 = function(sprite) {
  	sprite.opacity += 25
  };

  //==============================
  // * Setup Fog 1
  //==============================
  SpriteWeatherEX.prototype.setupFog1 = function(sprite, initial) {
  	sprite.opacity = 0;
  	var dir = Math.randomInt(100);
  	if (dir < 80) {
  		this.setPosNormal(sprite, 20, true);
  	} else {
  		this.setPosLeft(sprite, 20);
  	};
  	sprite.anchor.x = 0;
  	sprite.anchor.y = 1;
  	this.randomZoom(0.50, sprite);
  	var spd = (0.5 + Math.random() * 0.8)
  	var dir = Math.randomInt(2)
  	sprite._sx = dir == 0 ? spd : -spd;
  	sprite._ani[1] = Math.randomInt(10) + 10;
  	sprite._ani[2] = Math.randomInt(2) + 2;
  	sprite._ani[3] = 0;
  	sprite._ani[4] = 5;
  	sprite._ani[5] = Math.randomInt(2) + 1;
  	sprite._rt = 0;
  	if (dir === 0) {
  		sprite._zx = 0.004;
  		sprite._zy = 0.003;
  	} else {
  		sprite.scale.x = -sprite.scale.x
  		sprite._zx = -0.004;
  		sprite._zy = 0.003;
  	};
  };

  //==============================
  // * Setup Fog 2
  //==============================
  SpriteWeatherEX.prototype.setupFog2 = function(sprite, initial) {
  	sprite.opacity = 0;
  	this.setPosNormal(sprite, 20, true);
  	sprite.anchor.x = 0.5;
  	sprite.anchor.y = 1;
  	this.randomZoom(0.80, sprite, 20);
  	var rg = Math.randomInt(16) - 8;
  	sprite.rotation = (rg * Math.PI / 180);
  	sprite._sx = 0;
  	sprite._ani[1] = Math.randomInt(120) + 10;
  	sprite._ani[2] = Math.randomInt(2) + 2;
  	sprite._ani[3] = 0;
  	sprite._ani[4] = 50;
  	sprite._ani[5] = 2;
  	sprite._ani[7] = Math.randomInt(100) * 0.0001;
  	sprite._rt = 0;
  	sprite._zx = 0.012 + Math.randomInt(100) * 0.0001;
  	sprite._zy = 0.012 + Math.randomInt(100) * 0.0001;
  	if (sprite.opacity > 0) {
  		sprite._ani[1] = 0;
  	} else if (initial) {
  		var rd = Math.randomInt(100)
  		if (rd > 60) {
  			sprite._ani[1] = 0;
  			sprite.opacity = Math.randomInt(150) + 50;
  		};
  	};
  };

  //==============================
  // * Setup Fog 3
  //==============================
  SpriteWeatherEX.prototype.setupFog3 = function(sprite, initial) {
  	this.setPosNormal(sprite, 20, true);
  	sprite.anchor.x = 0;
  	sprite.anchor.y = 0.5;
  	this.randomZoom(0.50, sprite);
  	sprite.opacity = 0;
  	var rg = Math.randomInt(16) - 8;
  	sprite.rotation = 0;
  	sprite._sx = (0.5 + Math.random() * 0.8);;
  	sprite._ani[1] = Math.randomInt(80) + 10;
  	sprite._ani[2] = Math.randomInt(2) + 2;
  	sprite._ani[3] = 0;
  	sprite._ani[4] = 50;
  	sprite._ani[5] = 10;
  	sprite._rt = 0;
  	sprite._zx = 0.1;
  	sprite._zy = -0.04;
  	sprite.scale.x = 1.00;
  	sprite.scale.y = sprite.scale.x;
  	if (initial) {
  		var rd = Math.randomInt(100)
  		if (rd > 60) {
  			sprite._ani[1] = 0;
  			sprite.opacity = Math.randomInt(150) + 50;
  		};
  	};
  };

  //==============================
  // * Update Fog 1
  //==============================
  SpriteWeatherEX.prototype.updateFog1 = function(sprite) {
  	if (sprite._ani[1] > 0) {
  		sprite._ani[1]--;
  		return;
  	};
  	if (sprite._ani[3] == 0) {
  		sprite.opacity += sprite._ani[4];
  		if (sprite.opacity >= 255) {
  			sprite._ani[3] = 1
  		};
  	} else if (sprite._ani[3] == 1) {
  		sprite._ani[1]--;
  		if (sprite._ani[1] <= 0) {
  			sprite._ani[3] = 2
  		};
  	} else {
  		sprite.opacity -= sprite._ani[5];
  		this.updateScale(sprite);
  		if (sprite.opacity <= 0) {
  			this.refreshWeather(sprite)
  		};
  	};
  };

  //==============================
  // * Setup Fog XP 1
  //==============================
  SpriteWeatherEX.prototype.setupFogXP1 = function(sprite, initial) {
  	sprite._ani[1] = (this._speed + 0.1 + Math.random() * 2) * this.speed() / 100;
  	sprite._ani[2] = 0;
  	sprite._sy = Math.randomInt(100);
  };

  //==============================
  // * Setup Fog XP 2
  //==============================
  SpriteWeatherEX.prototype.setupFogXP2 = function(sprite, initial) {
  	sprite._ani[1] = 0;
  	sprite._ani[2] = (this._speed + 0.1 + Math.random() * 2) * this.speed() / 100;
  	sprite._sy = Math.randomInt(100);
  };

  //==============================
  // * Update Fog 5
  //==============================
  SpriteWeatherEX.prototype.updateScroll = function(sprite) {
  	sprite._sx -= sprite._ani[1];
  	sprite._sy -= sprite._ani[2];
  	sprite.origin.x = $gameMap.displayX() * $gameMap.tileWidth() + sprite._sx;
  	sprite.origin.y = $gameMap.displayY() * $gameMap.tileHeight() + sprite._sy;
  };

  //==============================
  // * Setup Parallax 1
  //==============================
  SpriteWeatherEX.prototype.setupParallax1 = function(sprite, initial) {
  	sprite._sx = 1 * this.speed() / 100;
  	sprite._sy = 1 * this.speed() / 100;
  	sprite.move(0, 0, Graphics.boxWidth + 32, Graphics.boxHeight + 32);
  	sprite.x = -16 + (Graphics.boxWidth / 2);
  	sprite.y = -16 + (Graphics.boxHeight / 2);
  };

  //==============================
  // * Update Parallax 1
  //==============================
  SpriteWeatherEX.prototype.updateParallax1 = function(sprite) {
  	sprite.origin.x = this._imgData[2] + (this.screenX() / sprite._sx);
  	sprite.origin.y = this._imgData[3] + (this.screenY() / sprite._sy);
  };

  //==============================
  // * Setup Parallax 2
  //==============================
  SpriteWeatherEX.prototype.setupParallax2 = function(sprite, initial) {
  	sprite.anchor.x = 0.0;
  	sprite.anchor.y = 0.0;
  	sprite._realX = 0;
  	sprite._realY = 0;
  	sprite._sx = 1 * this.speed() / 100;
  	sprite._sy = 1 * this.speed() / 100;
  	sprite.opacity = 255;
  };

  //==============================
  // * Update Parallax 2
  //==============================
  SpriteWeatherEX.prototype.updateParallax2 = function(sprite) {
  	sprite.x = sprite._realX - (this.screenX() / sprite._sx);
  	sprite.y = sprite._realY - (this.screenY() / sprite._sy);
  };

  //==============================
  // * Setup SunLight 1
  //==============================
  SpriteWeatherEX.prototype.setupSunLight1 = function(sprite) {
  	this._modePosX = 90;
  	this.randomZoom(0.50, sprite, 50);
  	var pos = Math.randomInt(100);
  	if (pos < 50) {
  		this.leftPos(sprite, 96);
  	} else {
  		this.randomPosX(sprite);
  		sprite._realY = -128;
  	};
  	sprite.anchor.x = 0;
  	sprite.anchor.y = 0;
  	var rg = Math.randomInt(2) + 44
  	sprite.rotation = (rg * Math.PI / 180);
  	sprite.opacity = 0;
  	sprite._ani[1] = Math.randomInt(120) + 10;
  	sprite._ani[2] = Math.randomInt(2) + 2;
  	sprite._ani[3] = 0;
  	sprite._ani[4] = 0;
  	sprite._ani[5] = 0;
  	sprite._ani[9] = sprite._realX;
  	sprite._ani[10] = sprite._realY;
  };

  //==============================
  // * Update Sun Light
  //==============================
  SpriteWeatherEX.prototype.updateSunLight = function(sprite) {
  	if (sprite._ani[1] > 0) {
  		sprite._ani[1]--;
  		return;
  	};
  	sprite._ani[5]++;
  	if (sprite._ani[5] > 15) {
  		sprite._ani[5] = 0;
  		sprite._realX = sprite._ani[9] + Math.randomInt(2) - 1
  	}
  	if (sprite._ani[3] === 0) {
  		sprite.opacity += sprite._ani[2];
  		if (sprite.opacity >= 255) {
  			sprite._ani[3] = 1;
  			sprite._ani[4] = (Math.randomInt(180) + 120) * this.speed() / 100;
  		};
  	} else if (sprite._ani[3] === 1) {
  		sprite._ani[4]--;
  		if (sprite._ani[4] <= 0) {
  			sprite._ani[3] = 2
  		};
  	} else if (sprite._ani[3] === 2) {
  		sprite.opacity -= sprite._ani[2];
  		if (sprite.opacity <= 0) {
  			this.refreshWeather(sprite)
  		};
  	};
  };

  //==============================
  // * Setup Star 1
  //==============================
  SpriteWeatherEX.prototype.setupStar1 = function(sprite) {
  	this.setPosLeftUpper(sprite);
  	this.randomZoom(0.20, sprite, 80);
  	sprite.anchor.x = 0.5;
  	sprite.anchor.y = 0.5;
  	sprite._ani[1] = Math.randomInt(2);
  	sprite.opacity = Math.randomInt(150) + 100;
  	sprite._sx = (sprite.scale.x * 3);
  	sprite._sy = (sprite.scale.y * 3);
  };

  //==============================
  // * Update Star 1
  //==============================
  SpriteWeatherEX.prototype.updateStar1 = function(sprite) {
  	if (sprite._ani[1] == 0) {
  		sprite.opacity -= 15;
  		if (sprite.opacity < 125) {
  			sprite._ani[1] = 1
  		};
  	} else {
  		sprite.opacity += 15;
  		if (sprite.opacity >= 255) {
  			sprite._ani[1] = 0
  		};
  	};
  };

  //==============================
  // * Setup Star 2
  //==============================
  SpriteWeatherEX.prototype.setupStar2 = function(sprite) {
  	this.setPosLeftUpper(sprite);
  	this.randomZoom(0.20, sprite, 80);
  	sprite.anchor.x = 0.5;
  	sprite.anchor.y = 0.5;
  	sprite._ani[1] = Math.randomInt(2);
  	sprite.opacity = Math.randomInt(150) + 100;
  	sprite._sx = (sprite.scale.x * 3);
  	sprite._sy = (sprite.scale.y * 3);
  	sprite._rt = Math.random() * 0.1;
  };

  //==============================
  // * Setut Shinning
  //==============================
  SpriteWeatherEX.prototype.setupShinning = function(sprite, initial) {
  	this.setPosNormal(sprite, 40, true);
  	this.randomZoom(0.10, sprite, 90);
  	sprite.anchor.x = 0.5;
  	sprite.anchor.y = 0.5;
  	sprite._ani[0] = false
  	sprite._ani[1] = Math.randomInt(2);
  	sprite._ani[4] = Math.randomInt(60)
  	if (sprite.opacity > 0 && !initial) {
  		sprite._ani[4] = Math.randomInt(20)
  	} else {
  		if (initial) {
  			sprite.opacity = 0;
  		} else {
  			sprite.opacity = Math.randomInt(50);
  		};
  	};
  	sprite._ani[3] = (Math.randomInt(180) + 30) * this.speed() / 100;
  	var rg = Math.randomInt(360);
  	sprite.rotation = (rg * Math.PI / 180);
  };

  //==============================
  // * Update Star 1
  //==============================
  SpriteWeatherEX.prototype.updateShinning = function(sprite) {
  	if (sprite._ani[4] > 0) {
  		sprite._ani[4]--;
  		sprite.visible = false;
  		return
  	};
  	sprite.visible = true;
  	if (!sprite._ani[0]) {
  		sprite.opacity += 4;
  		if (sprite.opacity >= 255) {
  			sprite._ani[0] = true
  		};
  	} else {
  		if (sprite._ani[3] > 0) {
  			sprite._ani[3]--;
  			if (sprite._ani[1] == 0) {
  				sprite.opacity -= 15;
  				if (sprite.opacity < 125) {
  					sprite._ani[1] = 1
  				};
  			} else {
  				sprite.opacity += 15;
  				if (sprite.opacity >= 255) {
  					sprite._ani[1] = 0
  				};
  			};
  		} else {
  			sprite.opacity -= 4;
  			if (sprite.opacity <= 0) {
  				this.refreshWeather(sprite)
  			};
  		};

  	};
  };

  //==============================
  // * Setup Shinning
  //==============================
  SpriteWeatherEX.prototype.setupStandStill = function(sprite, initial) {
  	this.setPosNormal(sprite, 40, true);
  	this.randomZoom(0.40, sprite, 80);
  	sprite.anchor.x = 0.5;
  	sprite.anchor.y = 0.5;
  	if (initial) {
  		sprite.opacity = Math.randomInt(100) + 155;
  	} else {
  		sprite.opacity = 0;
  	}
  	sprite._ani[2] = (sprite.scale.x * 4);
  	var rg = Math.randomInt(360);
  	sprite.rotation = (rg * Math.PI / 180);
  	sprite._sx = (sprite.scale.x * 3);
  	sprite._sy = (sprite.scale.y * 3);
  	if (this.speed() != 100) {
  		sprite._zx = (sprite._sx / 4) * this.speed() / 100
  		sprite._zy = (sprite._sy / 4) * this.speed() / 100;
  	};
  };

  //==============================
  // * Update Star 1
  //==============================
  SpriteWeatherEX.prototype.updateStandStill = function(sprite) {
  	sprite.opacity += 10;
  	sprite._realX += sprite._zx;
  	sprite._realY += sprite._zy;
  	sprite.x = sprite._realX - this.screenX() / sprite._ani[2];
  	sprite.y = sprite._realY - this.screenY() / sprite._ani[2];
  };


  //==============================
  // * Update Star 2
  //==============================
  SpriteWeatherEX.prototype.updateStar2 = function(sprite) {
  	sprite.opacity += 25;
  };

  //==============================
  // * Update Random3
  //==============================
  SpriteWeatherEX.prototype.speed = function() {
  	return this.data().speed;
  };

  //==============================
  // * need Update Position
  //==============================
  SpriteWeatherEX.prototype.needUpdatePosition = function() {
  	if (this.mode() === 28) {
  		return false
  	};
  	if (this.mode() === 31) {
  		return false
  	};
  	if (this.mode() === 32) {
  		return false
  	};
  	if (this.mode() === 33) {
  		return false
  	};
  	if (this.mode() === 34) {
  		return false
  	};
  	if (this.mode() === 35) {
  		return false
  	};
  	return true;
  };

  //==============================
  // * Update Position
  //==============================
  SpriteWeatherEX.prototype.updatePosition = function(sprite) {
  	sprite._realX += sprite._sx * this.speed() / 100;
  	sprite._realY += sprite._sy * this.speed() / 100;
  	sprite.x = sprite._realX - this.screenX();
  	sprite.y = sprite._realY - this.screenY();
  };

  //==============================
  // * Update Other
  //==============================
  SpriteWeatherEX.prototype.updateOther = function(sprite) {
  	sprite.rotation += sprite._rt * this.speed() / 100;
  	sprite.opacity += sprite._op;
  };

  //==============================
  // * Update Scale
  //==============================
  SpriteWeatherEX.prototype.updateScale = function(sprite) {
  	sprite.scale.x += sprite._zx * this.speed() / 100;
  	sprite.scale.y += sprite._zy * this.speed() / 100;
  };

  //==============================
  // * Update Wind
  //==============================
  SpriteWeatherEX.prototype.updateRollEffect = function(sprite) {
  	sprite._roll--;
  	if (sprite._roll <= 0) {
  		if (sprite.scale.x > -sprite._zp[0]) {
  			sprite.scale.x -= 0.02 * this.speed() / 100;
  		};
  	};
  };

  //==============================
  // * get Anime Data
  //==============================
  SpriteWeatherEX.prototype.getAnimeData = function(sprite) {
  	sprite._frames[0] = Math.randomInt(this.data().frameSpeed);
  	sprite._frames[1] = Math.randomInt(this.data().frames);
  	sprite._frames[2] = this.data().frameSpeed;
  	sprite._frames[3] = this._image.width / this.data().frames;
  	sprite._frames[4] = this._image.height;
  	this.refreshFrames(sprite);
  };

  //==============================
  // * Update Anime
  //==============================
  SpriteWeatherEX.prototype.updateAnime = function(sprite) {
  	sprite._frames[0]++;
  	if (sprite._frames[0] >= sprite._frames[2]) {
  		sprite._frames[0] = 0;
  		sprite._frames[1]++;
  		if (sprite._frames[1] >= this.data().frames) {
  			sprite._frames[1] = 0
  		};
  		this.refreshFrames(sprite);
  	};
  };

  //==============================
  // * refresh Frames
  //==============================
  SpriteWeatherEX.prototype.refreshFrames = function(sprite) {
  	var cw = sprite._frames[3];
  	var ch = sprite._frames[4];
  	var wd = cw * sprite._frames[1];
  	sprite.setFrame(wd, 0, cw, ch);
  };

  //==============================
  // * forceHideWeatherBattle
  //==============================
  SpriteWeatherEX.prototype.forceHideWeatherBattle = function() {
  	if (!$gameParty.inBattle()) {
  		return false
  	};
  	if (this.data().mode == 34) {
  		return true
  	};
  	if (this.data().mode == 35) {
  		return true
  	};
  	return false;
  };

  //==============================
  // * forceHideWeather
  //==============================
  SpriteWeatherEX.prototype.forceHideWeather = function() {
  	if (this.data().mode < 0) {
  		return true
  	};
  	if (this.forceHideWeatherBattle()) {
  		return true
  	};
  	return false;
  };

  //==============================
  // * Update
  //==============================
  SpriteWeatherEX.prototype.update = function() {
  	Sprite.prototype.update.call(this);
  	if (this.forceHideWeather()) {
  		this.visible = false;
  		return;
  	};
  	if (!this._camCheck && $gameParty.inBattle()) {
  		this._camCheck = true;
  		if (Imported.MOG_BattleCameraFrontal) {
  			this.setFrontalCamera()
  		};
  		if (Imported.MOG_BattleCamera) {
  			this.setCamScreen()
  		};
  		for (var i = 0; i < this._sprites.length; i++) {
  			this.refreshWeather(this._sprites[i], true);
  		};
  	};
  	if (this.needCheckImg()) {
  		this.checkImgPar()
  	};
  	for (var i = 0; i < this._sprites.length; i++) {
  		this.updateSprites(this._sprites[i]);
  	};
  };

  //==============================
  // * Update Sprites
  //==============================
  SpriteWeatherEX.prototype.updateSprites = function(sprite) {
  	if (this.isAnimated() && sprite._frames[3] == 0) {
  		this.getAnimeData(sprite)
  	}
  	if (sprite._ani[6] > 0) {
  		sprite._ani[6]--
  	};
  	if (sprite._ani[7] > 0) {
  		sprite.visible = false;
  		sprite._ani[7]--
  			return;
  	};
  	sprite.visible = true;
  	if (Imported.MOG_BattleCameraFrontal && !sprite.refreshMove && $gameParty.inBattle()) {
  		this.refreshTilingMove(sprite)
  	};
  	this.updateEffects(sprite)
  	if (this.needUpdatePosition()) {
  		this.updatePosition(sprite)
  	};
  	this.updateOther(sprite);
  	if (this.isAnimated() && sprite._frames[3] > 0) {
  		this.updateAnime(sprite)
  	}
  	if (this.needRefreshWeather(sprite)) {
  		this.refreshWeather(sprite, false)
  	};
  };