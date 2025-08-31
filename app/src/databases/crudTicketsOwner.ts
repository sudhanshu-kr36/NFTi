import {db} from '../firebase'


interface TicketOwner {
    contract_address: string;
    owner_adress: string;
    token_id:string;
    ticket_key:string;
    ticket_id:string;
    is_checked?:boolean;
}

interface DataSnapshot {
    key: string;  // The key (name) of the location that generated this snapshot.
    val(): any;  // Extracts the data from the snapshot.
    exists(): boolean;  // Checks whether the snapshot contains any data.
    child(path: string): DataSnapshot;  // Gets a child DataSnapshot for the specific key or path.
    forEach(action: (childSnapshot: DataSnapshot) => boolean | void): boolean;  // Iterates through each child snapshot.
  }

export const storeTicketOwner = async (ticketOwner:TicketOwner|null)=>{
    console.log("the store is called");
    db.ref('ticketsOwners').push({
        contract_address:ticketOwner?.contract_address ,
        owner_adress:ticketOwner?.owner_adress,
        token_id:ticketOwner?.token_id,
        ticket_key:ticketOwner?.ticket_key,
        ticket_id:ticketOwner?.ticket_id,
        is_checked:(ticketOwner?.is_checked)?ticketOwner?.is_checked:false
    }).then((snapshot)=>{
        console.log('Ticket owner stored successfully === ', snapshot.key);
    }).catch((error:'')=>{
        console.error('Error storing TicketOwner === ', error)
    })
}

export const updateTicketOwner = async (key:string, ticketOwner:TicketOwner) => {
    // Reference the specific location in the database using the key
    const dataRef = db.ref(`ticketsOwners/${key}`);
  
    // Update the data at that location
    return dataRef.update
     (ticketOwner)
      .then(() => {
        console.log(`Data with key ${key} updated successfully. ${key}` );
      })
      .catch((error) => {
        console.error(`Error updating data with key ${key}:`, error);
      });
  };

export const readAllTicketOwners= async()=>{
    return db.ref('ticketsOwners').once('value')
    .then((snapshot)=>{
        const ticketsOwners:{val:TicketOwner,key:string}[]=[];
        snapshot.forEach((childSnapshot) =>{
            ticketsOwners.push({val:childSnapshot.val(), key:childSnapshot.key});
        });
        return ticketsOwners
    })
}