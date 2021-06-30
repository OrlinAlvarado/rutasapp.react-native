import React, { useEffect, useRef, useState } from 'react'
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useLocation } from '../hooks/useLocation';
import { LoadingScreen } from '../pages/LoadingScreen';
import { Fab } from './Fab';


export const Map = () => {

   const [showPolyline, setShowPolyline] = useState(true);
   const { 
        hasLocation,
        initialPosition,
        getCurrentLocation,
        followUserLocation,
        stopFollowUserLocation,
        userLocation,
        routeLines
    } = useLocation();
    
   const mapVieRef = useRef<MapView>();
   const following = useRef<boolean>(true);
    
   useEffect(() => {
       followUserLocation();
       
       return () => {
           stopFollowUserLocation();
       }
   }, [])
   
   useEffect(() => {
       
        if( !following.current ) return;
        
       mapVieRef.current?.animateCamera({
           center: userLocation
       })
      
   }, [userLocation])
   
   const centerPosition = async() => {
       const location = await getCurrentLocation();
       following.current = true;
       mapVieRef.current?.animateCamera({
            center: location
       })
   }

   if(!hasLocation){
       return <LoadingScreen />
   }
    
    return (
        <>
            <MapView
                ref={ (el) => mapVieRef.current = el! }
                style={{ flex: 1 }}
                //provider={ PROVIDER_GOOGLE }
                showsUserLocation
                initialRegion={{
                    latitude: initialPosition.latitude,
                    longitude: initialPosition.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
                onTouchStart={() => following.current = false }
            >
                {
                    showPolyline && 
                    <Polyline 
                        coordinates={ routeLines }
                        strokeColor= "black"
                        strokeWidth={ 3 }
                    />
                }
                
                {/* <Marker
                    image={ require('../assets/custom-marker.png')}
                    coordinate={{
                        latitude: 37.78825,
                        longitude: -122.4324,
                    }}
                    title="Este es un titulo"
                    description="Esto es una descripcion del marcador"
                    /> */}
            </MapView> 
            <Fab 
                iconName="compass-outline"
                onPress={ centerPosition }
                style={{
                    position: 'absolute',
                    bottom: 20,
                    right: 20
                }}
            />  
            <Fab 
                iconName="brush-outline"
                onPress={ () => setShowPolyline( !showPolyline ) }
                style={{
                    position: 'absolute',
                    bottom: 80,
                    right: 20
                }}
            />  
        </>
    )
}
