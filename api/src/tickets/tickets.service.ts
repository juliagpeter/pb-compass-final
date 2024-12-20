import { Injectable, NotFoundException } from '@nestjs/common';
import { InternalServerErrorException } from '@nestjs/common';
import { Ticket } from './ticket.entity';
import { DbService } from '../db/db.service';

@Injectable()
export class TicketsService {
  constructor(private readonly dbService: DbService) { }

  async create(ticket: Ticket): Promise<Ticket> {
    return new Promise((resolve, reject) => {
      this.dbService.getTicketDatastore().insert(ticket, (err, newDoc) => {
        if (err) reject(err);
        else resolve(newDoc);
      });
    });
  }

  async findAll(): Promise<Ticket[]> {
    return new Promise((resolve, reject) => {
      this.dbService.getTicketDatastore().find({}, (err, docs) => {
        if (err) reject(err);
        else resolve(docs);
      });
    });
  }

  async findOne(id: string): Promise<Ticket> {
    return new Promise((resolve, reject) => {
      this.dbService.getTicketDatastore().findOne({ _id: id }, (err, doc) => {
        if (err) reject(err);
        if (!doc) {
          console.log(`Ticket with ID ${id} not found in the database.`);
          reject(new NotFoundException(`Ticket with ID ${id} not found.`));
        }
        resolve(doc);
      });
    });
  }  

  async update(id: string, ticket: Ticket): Promise<Ticket> {
    return new Promise((resolve, reject) => {
      this.dbService.getTicketDatastore().update({ _id: id }, ticket, {}, (err, numReplaced) => {
        if (err) reject(err);
        if (numReplaced === 0) throw new NotFoundException(`Ticket with ID ${id} not found.`);
        resolve(ticket);
      });
    });
  }

  async remove(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.dbService.getTicketDatastore().remove({ _id: id }, {}, (err, numRemoved) => {
        if (err) reject(err);
        if (numRemoved === 0) throw new NotFoundException(`Ticket with ID ${id} not found.`);
        resolve();
      });
    });
  }
}