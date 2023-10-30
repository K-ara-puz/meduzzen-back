import { Module } from "@nestjs/common";
import { dbConnection } from "./db.source";

@Module({
  providers:[...dbConnection],
  exports:[...dbConnection],
})

export class DbModule{}