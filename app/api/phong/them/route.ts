import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Log the received data
    console.log('Received room data:', body);
    
    // Validate required fields
    if (!body.SoPhong || !body.DayPhong || !body.GiaPhong) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Missing required fields' 
        },
        { status: 400 }
      );
    }
    
    // Here you would typically save to database
    // For now, we'll just return success
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'Phòng đã được thêm thành công',
        data: body 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding room:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Thêm phòng thất bại',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 