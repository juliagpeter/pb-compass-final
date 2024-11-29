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
        resolve(newDoc);
      });
    });
  }

  async findAll(): Promise<Ticket[]> {
    return new Promise((resolve, reject) => {
      this.dbService.getTicketDatastore().find({}, (err, docs) => {
        if (err) reject(err);
        resolve(docs);
      });
    });
  }

  async findOne(id: string): Promise<Ticket> {
    try {
      return new Promise((resolve, reject) => {
        this.dbService.getTicketDatastore().findOne({ _id: id }, (err, doc) => {
          if (err) reject(err);
          if (!doc) reject(new NotFoundException(`Ticket with ID ${id} not found.`));
          resolve(doc);
        });
      });
    } catch (error) {
      console.error('Error finding ticket:', error);
      throw new InternalServerErrorException('An unexpected error occurred while finding the ticket.');
    }
  }

  async update(id: string, ticket: Ticket): Promise<Ticket> {
    return new Promise((resolve, reject) => {
      this.dbService.getTicketDatastore().update({ _id: id }, ticket, {},
        (err, numReplaced) => {
          if (err) {
            console.error('Error updating ticket:', err);
            reject(new InternalServerErrorException('Failed to update ticket.'));
          } else if (numReplaced === 0) {
            console.warn(`Ticket with ID ${id} not found for update.`);
            reject(new NotFoundException(`Ticket with ID ${id} not
    found.`));
          } else {
            resolve(ticket);
          }
        });
    });
  }

  async remove(id: string): Promise<void> {
    try {
      return new Promise((resolve, reject) => {
        this.dbService.getTicketDatastore().remove({ _id: id }, {}, (err,
          numRemoved) => {
          if (err) {
            reject(err);
          }
          if (numRemoved === 0) {
            reject(new NotFoundException(`Ticket with ID ${id} not
      found.`));
          }
          resolve();
        });
      });
    } catch (error) {
      console.error('Error removing ticket:', error);
      throw new InternalServerErrorException('An unexpected error occurred while removing the ticket.');
    }
  }
}