const data = `
create table chaptertable
(
    course_id     int                     null,
    chapter_id    int                     null,
    chapter_index int                     null comment '视频序号',
    chapter_name  varchar(1000)           null comment '视频名字',
    catalog_name  varchar(255) default '' null comment '大章节名称',
    catalog_index int                     null comment '章节序号',
    cpi           int                     null,
    clazzid       int                     null,
    attachments   varchar(10000)          null,
    user_id       int                     null comment '用户id',
    is_passed     int                     null comment '0未完成 1完成'
);
`;
