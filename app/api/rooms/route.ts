import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Log the received data
    console.log('Received room data:', body);
    
    // Here you would typically save to database
    // For now, we'll just return success
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'Room added successfully',
        data: body 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding room:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to add room',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Mock data for testing
    const rooms = [
      {
        id: 1,
        name: 'Room 101',
        status: 'available',
        price: 5000000,
        area: 25,
        capacity: 2
      },
      {
        id: 2,
        name: 'Room 102',
        status: 'booked',
        price: 6000000,
        area: 30,
        capacity: 3
      }
    ];
    
    return NextResponse.json(
      { 
        success: true, 
        data: rooms 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching rooms:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch rooms',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 