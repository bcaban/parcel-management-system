package com.webappsbusters.parcelmanagement.mapper;

import com.webappsbusters.parcelmanagement.domain.Parcel;
import com.webappsbusters.parcelmanagement.domain.ParcelDto;
import com.webappsbusters.parcelmanagement.domain.ParcelStatus;
import com.webappsbusters.parcelmanagement.domain.ParcelStatusDto;
import ma.glasnost.orika.MapperFactory;
import ma.glasnost.orika.converter.ConverterFactory;
import ma.glasnost.orika.impl.ConfigurableMapper;
import org.springframework.stereotype.Component;

//how to implement (from AttemptTest)
//MapperFacade facade = new OrikaMapper();
//ParcelDto parcel1clone = facade.map(parcel1, ParcelDto.class);

@Component
public class OrikaMapper extends ConfigurableMapper {
    @Override
    protected void configure(MapperFactory factory) {
        factory.classMap(Parcel.class, ParcelDto.class)
                .byDefault()
                .register();
        factory.classMap(ParcelStatus.class, ParcelStatusDto.class)
                .byDefault()
                .register();

        ConverterFactory converterFactory = factory.getConverterFactory();
        converterFactory.registerConverter(new EnumConverter());
    }
}
