import {Queue , Worker} from "bullmq";
import { redisConnection , defaultQueueConfig } from "../config/queue.js";
import logger from "../config/logger.js";
import { sendEmail } from "../config/mailer.js";


export const emailQueueName = "email-queue";

export const emailQueue = new Queue(emailQueueName, {
    connection : redisConnection,
    defaultJobOptions : defaultQueueConfig
});

export const handler = new Worker(emailQueueName, async (job) => {
    console.log("the email worker data is", job.data);
    const data = job.data;
    data?.map(async (email) => {
        await sendEmail(email.toEmail, email.subject, email.body);
    })

}, {connection : redisConnection});



// worker listners


handler.on("completed", (job) => {
    logger.info({ job: job, message: "Job completed" });
    console.log(`the job ${job.id} is completed`);
  });
  
  handler.on("failed", (job) => {
    console.log(`the job ${job.id} is failed`);
  });

