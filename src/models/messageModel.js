class message{
    constructor(id, threadid, senderid, content, senddate, deleted_at){
        this.id = id;
        this.threadid = threadid;
        this.senderid = senderid;
        this.content = content;
        this.senddate = senddate;
        this.deleted_at = deleted_at;
    }

}

export default message;