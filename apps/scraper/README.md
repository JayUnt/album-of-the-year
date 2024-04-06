# TODO
- [ ] finish basic setup where one function just does it all
- [ ] extract function for triggering get all new albums from genre pages
- [ ] extract function for updating album from album detail page
- [ ] Get it back working with the 2 functions
- [ ] Attempt ideal state


# ideal state
  3) cron job triggers new job to get all new albums
  4) new albums task gets albums then triggers new jobs for each new album to get details


## Resourses for job queue
https://github.com/hatchet-dev/hatchet
https://github.com/bee-queue/bee-queue
https://medium.com/@adarsh-d/implementing-a-job-queue-in-node-js-13a41dbdc98e
https://www.npmjs.com/package/bull
https://www.npmjs.com/package/agenda