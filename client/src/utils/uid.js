function uid() {
    const head = Date.now().toString();
    const tail = Math.random().toString(36).substring(2);

    return head + tail;
}

export default uid;